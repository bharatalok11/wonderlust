// This module defines a custom error class for handling HTTP errors in an Express application.
// It extends the built-in Error class to include an HTTP status code and a message.
class ExpressError extends Error {
    constructor(statusCode, message) {
        super();  // Calls the parent (Error) constructor
        this.statusCode = statusCode;  // Stores HTTP status code
        this.message = message;  // Stores the custom error message
    }
}
module.exports = ExpressError;
