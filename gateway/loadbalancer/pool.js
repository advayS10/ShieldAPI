module.exports = {
  userServices: [
    { url: 'http://user-service-1:4000', healthy: true },
    { url: 'http://user-service-2:4000', healthy: true },
    { url: 'http://user-service-3:4000', healthy: true }
  ],
  postServices: [
    { url: 'http://post-service-1:4000', healthy: true },
    { url: 'http://post-service-2:4000', healthy: true },
    { url: 'http://post-service-3:4000', healthy: true }
  ],
  userIndex: 0,
  postIndex: 0
};