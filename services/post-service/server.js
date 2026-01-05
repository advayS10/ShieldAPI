const express = require('express');
const app = express();

app.use(express.json());

app.get('/posts', (req, res) => {
    res.json({
        service: 'post-service',
        posts: ['Post 1', 'Post 2', 'Post 3']
    });
});

app.get('/health', (req, res) => {
  res.status(200).send({ status: 'UP' });
});

app.listen(4000, () => {
    console.log('Post Service running on port 5002');
});