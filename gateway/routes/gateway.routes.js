const express = require("express");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiresIn } = require("../config/env");
const router = express.Router();
const ROLES = require("../utils/roles");
const authenticateJWT = require("../middleware/auth");
const rbac = require("../middleware/rbac");
const rateLimiter = require("../middleware/rateLimiter");
const forwardRequest = require("../proxy/forward");
const authController  = require('../controllers/authController')
const authRateLimiter = require('../middleware/authRateLimiter')

const { signup, login } = authController;
const { loginLimiter, signupLimiter } = authRateLimiter;

// Login route  (Public)
router.post("/login", loginLimiter, rateLimiter, login);

router.post("/signup", signupLimiter, rateLimiter, signup);

router.use(
  '/revcode',
  authenticateJWT,
  rbac([ROLES.ADMIN, ROLES.USER]),
  rateLimiter,
  (req, res) => {
    req.params.service = 'revcode';
    forwardRequest(req, res);
  }
)

router.get('/health', (req, res) => {
  res.json({ status: 'gateway-ok' });
});


/*
// User Service
router.use(
  '/user',
  authenticateJWT,
  rbac([ROLES.ADMIN, ROLES.USER]),
  rateLimiter,
  (req, res) => {
    req.params.service = 'user';
    forwardRequest(req, res);
  }
);

router.use(
  '/post',
  authenticateJWT,
  rbac([ROLES.ADMIN, ROLES.USER]),
  rateLimiter,
  (req, res) => {
    req.params.service = 'post';
    forwardRequest(req, res);
  }
);
*/
module.exports = router;

/*
What does this code do?
This code defines an Express router for handling user authentication in a gateway service. It includes a login route that verifies user credentials against a dummy user database and generates a JWT token upon successful authentication. Additionally, it has a protected route that requires JWT authentication to access user profile information.

Why is it needed?
This code is needed to provide secure authentication mechanisms in a microservices architecture. By issuing JWT tokens, it allows users to authenticate once and access multiple services without needing to log in repeatedly. The protected routes ensure that only authenticated users can access sensitive information, enhancing the overall security of the application.

How does it work?
1. The `/login` route accepts a username and password, checks them against a predefined list of users, and generates a JWT token if the credentials are valid.
2. The token is signed using a secret key and has an expiration time defined in the environment configuration.
3. The `/profile` route is protected by the `authencateJWT` middleware, which verifies the JWT token sent in the request headers. If the token is valid, it allows access to the route and provides user information; otherwise, it returns an unauthorized error.

*/

/*
// admin route
router.get("/admin", authenticateJWT, rateLimiter, rbac([ROLES.ADMIN]), (req, res) => {
  res.json({ message: "Welcome, Admin!" });
});

// admin + user route
router.get("/user", authenticateJWT, rateLimiter, rbac([ROLES.ADMIN, ROLES.USER]), (req, res) => {
  res.json({ message: "Welcome user!" });
});

// service route
router.get("/service", authenticateJWT, rateLimiter, rbac([ROLES.SERVICE]), (req, res) => {
  res.json({ message: "Welcome, Service!" });
});



// Example protected route

router.get("/profile", authenticateJWT, (req, res) => {
  console.log("User profile accessed:", req.user);
  res.json({ message: "This is a protected profile route", user: req.user });
});
*/