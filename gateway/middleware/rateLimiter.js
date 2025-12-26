const redis = require('../config/redis');
const RATE_LIMITS = require('../utils/rateLimits');

const BLOCKED_IP_KEY = 'blocked:ips';
const WINDOW_SIZE_IN_SECONDS = 60; // 1 minute window

const rateLimiter = async (req, res, next) => {
    try {
        const ip = req.ip;
        const role = (req.user?.role || 'GUEST').toUpperCase();

        const isBlocked = await redis.sismember(BLOCKED_IP_KEY, ip);
        if (isBlocked) {
            return res.status(403).json({
                message: 'Your IP is blocked',
            });
        }

        const limitConfig = RATE_LIMITS[role];
        if (!limitConfig) return next();

        const key = `rate:${role}:${ip}`;
        const now = Math.floor(Date.now() / 1000);

        let { tokens, lastRefill } = await redis.hgetall(key); // hgetall retrieve all field value pair for particular key as strings 

        tokens = tokens ? parseInt(tokens, 10) : limitConfig.tokens; // if no tokens, set to max tokens
        lastRefill = lastRefill ? parseInt(lastRefill, 10) : now; // if no lastRefill, set to now

        const elapsed = now - lastRefill; // time since last refill in seconds
        
        if (elapsed > 0) { 
            const refill = Math.floor(
                (elapsed / WINDOW_SIZE_IN_SECONDS) * limitConfig.refillRate
            ); // calculate how many tokens to refill based on elapsed time
            
            if (refill > 0) {
                tokens = Math.min(tokens + refill, limitConfig.tokens);
                lastRefill = now;
            } // update lastRefill time
        }

        if (tokens <= 0) {
            return res.status(429).json({ message: 'Rate limit exceeded' });
        }

        tokens -= 1;

        await redis.hmset(key, { // hmset set multiple field value pair for particular key
            tokens,
            lastRefill,
        });

        await redis.expire(key, WINDOW_SIZE_IN_SECONDS * 2); // set expiration to avoid memory leaks

        next();
    } catch (error) {
        console.error('Rate limiter error:', error);
        next();
    }
};

module.exports = rateLimiter;

/*
redis-cli
SADD blocked:ips 127.0.0.1
*/

/*
What this file does?
This file implements a rate limiting middleware for an API gateway using Redis as the backend store. It checks the number of requests made by a user (identified by their IP address and role) within a specified time window and restricts access if the limit is exceeded. It also checks if the user's IP is blocked.
If the IP is blocked, it responds with a 403 status code. If the user exceeds their rate limit, it responds with a 429 status code. Otherwise, it allows the request to proceed.

How does it work?
1. It retrieves the user's IP address and role from the request.
2. It checks if the IP is in the blocked list stored in Redis.
3. It fetches the current token count and last refill time from Redis.
4. It calculates the number of tokens to refill based on the elapsed time since the last refill.
5. If the user has tokens available, it decrements the token count and allows the request to proceed. If not, it responds with a rate limit exceeded message.
6. The token count and last refill time are updated in Redis with an expiration time to manage memory usage.

Why is it needed?
Rate limiting is essential to protect APIs from abuse, ensure fair usage among users, and maintain the overall performance and availability of the service. By implementing rate limiting based on user roles, the system can provide differentiated access levels, allowing more privileged users (like admins) to have higher limits compared to regular users or guests.
*/
