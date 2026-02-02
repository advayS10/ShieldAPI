const Redis = require('ioredis');

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost', // Redis server host
  port: process.env.REDIS_PORT || 6379,        // Redis server port
});

redis.on('connect', () => {
  console.log('Connected to Redis server');
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = redis;

/*
What This Code Does:
1. Imports the ioredis library to interact with a Redis database.
2. Creates a new Redis client instance configured to connect to a Redis server running on localhost at the default port 6379.
3. Sets up event listeners to log messages when the connection to the Redis server is established or if there is an error.
4. Exports the Redis client instance for use in other parts of the application.

Why These Settings Matter:
- Connection settings are crucial for establishing a reliable connection to the Redis instance.
- Event listeners help in monitoring the connection status and troubleshooting any issues.
*/