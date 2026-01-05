const axios = require('axios');
const pool = require('./pool');

async function checkHealth() {
    const services = [
        ...pool.userServices,
        ...pool.postServices
    ]

    for (let s of services) {
        try {
            const response = await axios.get(`${s.url}/health`);
            s.healthy = response.status === 200;
        } catch (error) {
            s.healthy = false;
        }
    }
}

setInterval(() => {
    checkHealth();
}, 10000); // Check every 30 seconds
