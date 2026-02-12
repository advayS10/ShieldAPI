require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
    mongodbURI: process.env.MONGODB_URI,
    nodeenv: process.env.NODE_ENV || "",
};

/*
What This Code Does:
1. Loads environment variables from a .env file using the dotenv package.
2. Exports an object containing configuration settings:

Why These Settings Matter:
- port: Specifies the port on which the server will run. Defaults to 3000 if not set.
- jwtSecret: A secret key used for signing JSON Web Tokens (JWTs). Essential for authentication and security.
- jwtExpiresIn: Defines the expiration time for JWTs, enhancing security by limiting token validity.

How to Use:
- Ensure you have a .env file in the root of your project with the necessary variables defined.
- Import this configuration module wherever needed in your application to access these settings.

*/