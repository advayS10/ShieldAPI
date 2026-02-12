const config = require('../config/env')

class ApiError extends Error {
    constructor(statusCode, message, details=null){
        super(message);
        this.statusCode = statusCode;
        this.details = details;
    }
}

const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';

    console.error(`[ERROR] ${statusCode} - ${message}`, err);

    res.status(statusCode).json({
        success: false,
        message,
        ...(config.nodeenv && { stack: err.stack })
    })
}

module.exports = { ApiError, errorHandler };