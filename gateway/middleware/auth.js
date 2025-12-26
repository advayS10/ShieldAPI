const jwt = require('jsonwebtoken');
const config = require('../config/env');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // console.log('Auth Header:', authHeader);
    
    if(authHeader){
        const token = authHeader.split(' ')[1];

        jwt.verify(token, config.jwtSecret, (err, user) => {
            if(err){
                return res.sendStatus(403); // Forbidden
            }
            req.user = user;
            next();
        });
    }else {
        res.status(401).json({ message: 'Authorization header missing' });
    }
};

module.exports = authenticateJWT;

/*
What This Code Does:
1. Imports the jsonwebtoken library and configuration settings.
2. Defines a middleware function `authenticateJWT` that checks for a JWT in the Authorization header of incoming requests.
3. If a token is present, it verifies the token using the secret key from the configuration.
4. If verification is successful, it attaches the decoded user information to the request object and calls `next()` to proceed to the next middleware or route handler.
5. If verification fails or no token is provided, it responds with appropriate HTTP status codes (401 for Unauthorized, 403 for Forbidden).

Why These Settings Matter:
- JWT Authentication: Secures API endpoints by ensuring that only requests with valid tokens can access protected resources.
- Middleware Function: Integrates seamlessly with Express.js to provide authentication checks on routes.

How to Use:
- Import and use this middleware in your route definitions to protect specific endpoints that require authentication.
*/