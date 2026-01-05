const pool = require('./pool');

function getNextServer(type) {
    const serviceList = type === 'user' ? pool.userServices : pool.postServices;
    const indexKey = type === 'user' ? 'userIndex' : 'postIndex';

    const healthyServers = serviceList.filter(s => s.healthy);
    if (!healthyServers.length) throw new Error('No healthy servers available');

    pool[indexKey] = (pool[indexKey] + 1) % healthyServers.length;
    return healthyServers[pool[indexKey]].url;
}

module.exports = {
    getNextServer
};