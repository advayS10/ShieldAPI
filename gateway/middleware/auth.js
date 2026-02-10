const jwt = require("jsonwebtoken");
const config = require("../config/env");
const Auth = require("../models/Auth");

const authenticateJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    // console.log('Auth Header:', authHeader);

    if (!authHeader) {
      res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(token, config.jwtSecret);

    const user = await Auth.findOne({ _id: decoded.id });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
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
