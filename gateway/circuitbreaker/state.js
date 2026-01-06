const circuits = {};

function getState(serviceUrl) {
    if (!circuits[serviceUrl]) {
        circuits[serviceUrl] = {
            failures: 0,
            state: 'CLOSED', // Possible states: 'CLOSED', 'OPEN', 'HALF_OPEN'
            lastFailureTime: null
        };
    }
    return circuits[serviceUrl];
}

module.exports = {
    getState
};

/*
What This Code Does:
1. Maintains an in-memory object `circuits` to track the state of each service's circuit breaker.
2. Defines a function `getState` that retrieves the circuit state for a given service URL, initializing it if it doesn't exist.
3. Each circuit state includes the number of failures, the current state (CLOSED, OPEN, HALF_OPEN), and the timestamp of the last failure.
Why These Settings Matter:
- Circuit State Tracking: Essential for implementing the circuit breaker pattern, allowing the system to monitor service health and prevent cascading failures.
- Initialization: Ensures that each service has a default state when first accessed, facilitating consistent behavior across services.
How to Use:
- Import the `getState` function in other modules (like the circuit breaker logic) to access and modify the state of service circuits as requests are processed.
*/