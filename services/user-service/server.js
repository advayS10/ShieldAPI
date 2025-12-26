const express = require('express');
const app = express();

app.use(express.json());

app.get('/users/profile', (req, res) => {
    res.json({
        service: 'user-service',
        user: req.headers['x-user'] || 'unknown'
    })
});

app.listen(5001, () => {
    console.log('User Service running on port 5001');
});

/*
What This Code Does:
1. Imports the Express framework.
2. Initializes an Express application.
3. Configures middleware to parse JSON request bodies.
4. Defines a GET endpoint at '/user/profile' that responds with a JSON object containing the service name and user information extracted from request headers.
5. Starts the server on port 5001 and logs a message indicating that the service is running.

Why These Settings Matter:
- JSON Parsing Middleware: Enables the server to handle JSON payloads in incoming requests, which is common in API interactions.
- User Profile Endpoint: Provides a simple API endpoint to retrieve user profile information, which can be expanded for more complex user data handling.    
- Port Configuration: Specifies the port on which the service listens, allowing it to be accessed by other services or clients.

How to Use:
- Start the server by running this file with Node.js.
- Access the user profile endpoint via HTTP GET request to 'http://localhost:5001/user/profile', including an 'x-user' header to simulate user identification.  
*/
