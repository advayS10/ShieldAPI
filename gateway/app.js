const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes/gateway.routes");
const rateLimiter = require("./middleware/rateLimiter");
const logger = require("./middleware/logger");
const { metricsMiddleware, client } = require("./middleware/metrics");
require("./loadbalancer/healthcheck.js");
const { ApiError, errorHandler } = require('./utils/errorHandler.js')
const helmet = require('helmet')
const { globalRateLimiter } = require("./middleware/globalRateLimiter");

const app = express();

app.set('trust proxy', 1);

app.use(helmet())
app.use(cors());
app.use(logger);
app.use(metricsMiddleware);

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

app.use(globalRateLimiter); // Apply global rate limiter to all routes

// Use the defined routes
app.use("/api", routes);
app.use(errorHandler)

app.use(rateLimiter); // Apply rate limiter middleware globally

module.exports = app;

/*
What This Code Does:
1. Imports necessary modules including Express, body-parser, cors, and custom routes.
2. Initializes an Express application.
3. Configures middleware for CORS and JSON body parsing.
4. Sets up routing for API endpoints under the '/api' path.
5. Exports the configured Express app for use in other parts of the application.

Why These Settings Matter:
- CORS Middleware: Enables cross-origin requests, which is essential for APIs accessed from different domains.
- Body Parser: Allows the server to handle JSON payloads in requests, facilitating data exchange.
- Routing: Organizes API endpoints, making the application modular and easier to maintain.

How to Use:
- Import this app module in your server entry point (e.g., server.js) to start the server.

*/
