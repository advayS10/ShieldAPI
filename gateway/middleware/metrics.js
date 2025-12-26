const client = require('prom-client')
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status_code'],
});

const httpRequestDuration = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [50, 100, 200, 500, 1000]
});

const metricsMiddleware = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;

        httpRequestsTotal.inc({
            method: req.method,
            route: req.route?.path || req.originalUrl,
            status_code: res.statusCode
        });

        httpRequestDuration.observe({
            method: req.method,
            route: req.route?.path || req.originalUrl,
            status_code: res.statusCode
        }, duration);
    }
    );
    next();
};

module.exports = {metricsMiddleware, client};
/*
What does this code do?
This code defines a middleware for an Express.js application that collects metrics about HTTP requests using the prom-client library. It tracks the total number of HTTP requests and the duration of each request, categorized by HTTP method, route, and status code.
Why is it useful?
Collecting these metrics is essential for monitoring the performance and health of a web application. It helps developers understand traffic patterns, identify slow endpoints, and troubleshoot issues effectively.
*/