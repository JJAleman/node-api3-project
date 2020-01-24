const express = require('express');

// importing my routes
const UserRouter = require('./users/userRouter');
const PostRouter = require('./posts/postRouter');

const server = express();

//custom middleware
server.use(express.json());
server.use(logger);
server.use('/api/users', UserRouter);

// Still needs to complete for stretch
server.use('/api/posts', PostRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});



function logger(req, res, next) {
  console.log(`${Date()} ${req.method} to ${req.url} from ${req.get('Origin')}`);
}

module.exports = server;
