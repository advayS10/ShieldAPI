const rateLimiter = require("./rateLimiter");

exports.globalRateLimiter = rateLimiter({
    getKey: (req) => {
        req.ip;
    },
    getLimitConfig: () => ({
        name: 'GLOBAL',
        tokens: 1000,
        refillRate: 1000
    })
});