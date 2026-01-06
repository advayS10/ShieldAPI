const { getState } = require('./state');

const FAILURE_THRESHOLD = 3; // Number of failures to trigger OPEN state
const COOLDOWN_TIME = 30000; // Time in ms to wait before transitioning to HALF_OPEN

function canRequest(serviceUrl) {
    const circuit = getState(serviceUrl);

    if (circuit.state === 'OPEN') {
        const now = Date.now();
        if (now - circuit.lastFailureTime > COOLDOWN_TIME) {
            circuit.state = 'HALF_OPEN';
            console.log(`[CIRCUIT] ${serviceUrl} -> HALF_OPEN`)
            return true; // Allow a test request
        }
        return false; // Reject request
    }

    return true; // CLOSED or HALF_OPEN allows requests
}

function onSuccess(serviceUrl) {
    const circuit = getState(serviceUrl);
    
    if (circuit.state === 'HALF_OPEN') {
        console.log(`[CIRCUIT] ${serviceUrl} -> CLOSED`)
    }
    circuit.failures = 0;
    circuit.state = 'CLOSED';
}

function onFailure(serviceUrl) {
    const circuit = getState(serviceUrl);
    circuit.failures += 1;
    
    if (circuit.failures >= FAILURE_THRESHOLD) {
        circuit.state = 'OPEN';
        circuit.lastFailureTime = Date.now();
        console.log(`[CIRCUIT] ${serviceUrl} -> OPEN`)
    }
}

module.exports = {
    canRequest,
    onSuccess,
    onFailure
};

/*
What This Code Does:
1. Implements a simple circuit breaker pattern to manage service availability.
2. Defines three main functions:
    - `canRequest(serviceUrl)`: Determines if a request can be made to the service based on its circuit state.
    - `onSuccess(serviceUrl)`: Resets the circuit state to CLOSED on a successful request.
    - `onFailure(serviceUrl)`: Increments failure count and potentially opens the circuit on repeated failures.

Why These Settings Matter:
- Failure Threshold: Prevents overwhelming a failing service by opening the circuit after a set number of failures.
- Cooldown Time: Allows time for a service to recover before attempting to send requests again.

How to Use:
- Integrate these functions into the request forwarding logic to monitor and control access to downstream services based on their health.
*/
