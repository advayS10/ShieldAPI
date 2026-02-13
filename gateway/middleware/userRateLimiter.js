const ROLE_LIMITS = {
    ADMIN: { tokens: 100, refillRate: 100 },
    USER: { tokens: 20, refillRate: 20 },
    SERVICE: { tokens: 200, refillRate: 200 },
    GUEST: { tokens: 30, refillRate: 30 },
}

exports.userRateLimiter = rateLimiter({
    getKey: (req) => {
        return req.user ? req.user.id : req.ip;
    },
    getLimitConfig: (req) => {
        const role = (req.user?.role || 'GUEST').toUpperCase();
        const config = ROLE_LIMITS[role];
        if (!config) return null;
        return { name: role, ...config }; 
    }
});