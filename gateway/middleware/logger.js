const logger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(
        `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ` +
        `${res.statusCode} ${duration}ms`
        );
    }
    );
    next();
};
module.exports = logger;

/*
What does this code do?
This code defines a middleware function for a Node.js/Express application that logs details about each incoming HTTP request. When a request is received, it records the start time. Once the response is finished, it calculates the duration of the request and logs the HTTP method, the requested URL, the response status code, and the time taken to process the request in milliseconds. This information is useful for monitoring and debugging purposes.

Why is it useful?
Logging request details helps developers and system administrators track the performance of their web applications, identify bottlenecks, and troubleshoot issues. By knowing how long each request takes and the status of the response, they can optimize the application and ensure a better user experience.

what is res.on('finish', ...)?
The res.on('finish', ...) method is an event listener that listens for the 'finish' event on the response object (res). This event is emitted when the response has been sent to the client and all data has been flushed. By attaching a listener to this event, the middleware can execute code (in this case, logging) right after the response is fully processed, allowing it to capture accurate timing and status information about the request.
*/