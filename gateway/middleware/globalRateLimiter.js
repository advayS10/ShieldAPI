const rateLimiter = require("./rateLimiter");

const globalRateLimiter = rateLimiter({
    getKey: (req) => req.ip,
    getLimitConfig: () => ({
        name: 'GLOBAL',
        tokens: 1000,
        refillRate: 1000
    })
});

module.exports = { globalRateLimiter };