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