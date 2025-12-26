const RATE_LIMITS = {
    ADMIN: { tokens: 100, refilRate: 100 },
    USER: { tokens: 20, refilRate: 20 },
    SERVICE: { tokens: 200, refilRate: 200 },
    GUEST: { tokens: 5, refilRate: 5 },
};

module.exports = RATE_LIMITS;

/*
What this file does?
This file defines and exports a set of rate limit configurations for different user roles (ADMIN, USER, SERVICE, GUEST). Each role has a specified number of tokens and a refill rate, which can be used to implement rate limiting in the application.

What is token and refilRate?
- token: This represents the maximum number of requests a user with a specific role can make within a certain time frame.
- refilRate: This indicates how many tokens are replenished over a defined period, allowing users to regain their ability to make requests after hitting their limit.

*/