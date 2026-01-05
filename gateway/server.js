const app = require('./app');
const config = require('./config/env');


const PORT = config.port || 3000;

app.listen(PORT, () => {
    console.log(`Gateway server is running on port ${PORT}`);
});

/*
What This Code Does:
1. Imports the configured Express application from app.js.
2. Imports configuration settings from env.js.
3. Retrieves the port number from the configuration, defaulting to 3000 if not specified.
4. Starts the Express server, listening on the specified port.
5. Logs a message to the console indicating that the server is running and on which port.

Why These Settings Matter:
- Port Configuration: Allows flexibility in choosing the port for the server, which can be important for deployment in different environments.

How to Use:
- Run this server.js file to start the gateway server. Ensure that the necessary environment variables are set in the .env file or the environment.
*/