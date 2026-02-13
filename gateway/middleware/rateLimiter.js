const redis = require('../config/redis');
const RATE_LIMITS = require('../utils/rateLimits');

const BLOCKED_IDENTITIES_KEY = 'blocked:identities';
const WINDOW_SIZE_IN_SECONDS = 60; // 1 minute window

// In-memory fallback bucket map used when Redis is unavailable or slow.
// Keyed by `${role}:${identity}` -> { tokens, lastRefill, lastSeen }
const inMemoryBuckets = new Map();
const IN_MEMORY_TTL_MS = 10 * 60 * 1000; // 10 minutes

function cleanupInMemoryBuckets() {
    const now = Date.now();
    for (const [k, v] of inMemoryBuckets.entries()) {
        if (now - v.lastSeen > IN_MEMORY_TTL_MS) inMemoryBuckets.delete(k);
    }
}

// Perform periodic cleanup to avoid memory leak
setInterval(cleanupInMemoryBuckets, IN_MEMORY_TTL_MS).unref();

function getInMemoryBucket(key, limitConfig) {
    const now = Math.floor(Date.now() / 1000);
    let b = inMemoryBuckets.get(key);
    if (!b) {
        b = { tokens: limitConfig.tokens, lastRefill: now, lastSeen: Date.now() };
        inMemoryBuckets.set(key, b);
        return b;
    }

    // refill logic (same as Redis-backed)
    const elapsed = now - b.lastRefill;
    if (elapsed > 0) {
        const refill = Math.floor((elapsed / WINDOW_SIZE_IN_SECONDS) * limitConfig.refillRate);
        if (refill > 0) {
            b.tokens = Math.min(b.tokens + refill, limitConfig.tokens);
            b.lastRefill = now;
        }
    }
    b.lastSeen = Date.now();
    return b;
}

const rateLimiter = async (req, res, next) => {
    try {
        const identity = req.user ? req.user.id : req.ip;
        const role = (req.user?.role || 'GUEST').toUpperCase();

        // Check blocked list in Redis; if Redis fails, fall back to proceeding (safe default: allow)
        try {
            const isBlocked = await redis.sismember(BLOCKED_IDENTITIES_KEY, identity);
            if (isBlocked) {
                return res.status(403).json({ message: 'Your IP is blocked' });
            }
        } catch (err) {
            console.error('Redis blocked-check error, falling back:', err.message || err);
            // proceed to fallback below
        }

        const limitConfig = RATE_LIMITS[role];
        if (!limitConfig) return next();

        const key = `rate:${role}:${param}`;
        const now = Math.floor(Date.now() / 1000);

        // Try Redis-backed token bucket first; if Redis fails, use in-memory fallback
        try {
            let { tokens, lastRefill } = await redis.hgetall(key);

            tokens = tokens ? parseInt(tokens, 10) : limitConfig.tokens;
            lastRefill = lastRefill ? parseInt(lastRefill, 10) : now;

            const elapsed = now - lastRefill;
            if (elapsed > 0) {
                const refill = Math.floor(
                    (elapsed / WINDOW_SIZE_IN_SECONDS) * limitConfig.refillRate
                );
                if (refill > 0) {
                    tokens = Math.min(tokens + refill, limitConfig.tokens);
                    lastRefill = now;
                }
            }

            if (tokens <= 0) return res.status(429).json({ message: 'Rate limit exceeded' });

            tokens -= 1;

            await redis.hmset(key, { tokens, lastRefill });
            await redis.expire(key, WINDOW_SIZE_IN_SECONDS * 2);

            return next();
        } catch (redisError) {
            // Redis failed: use in-memory fallback token bucket
            console.error('Redis error in rateLimiter, using in-memory fallback:', redisError.message || redisError);

            const memKey = `${role}:${identity}`;
            const bucket = getInMemoryBucket(memKey, limitConfig);

            if (bucket.tokens <= 0) {
                return res.status(429).json({ message: 'Rate limit exceeded (fallback)' });
            }

            bucket.tokens -= 1;
            return next();
        }
    } catch (error) {
        console.error('Rate limiter error:', error);
        // Last resort: allow the request to avoid blocking critical traffic
        next();
    }
};

module.exports = rateLimiter;

/*
redis-cli
SADD blocked:ips 127.0.0.1
*/


