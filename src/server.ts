import express from 'express';
import { userRepository } from './dao/user-repository';
import authenticationRouter from './routes/auth-router';
import cors from 'cors';
import userRouter from './routes/users-router';

const app = express();

const port = 2704;

app.use(cors());

app.locals.userRepo = userRepository;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authenticationRouter);
app.use('/users', userRouter)

// Additional middleware which will set headers that we need on each request.
app.use(function (req, res, next) {
  // Set permissive CORS header - this allows this server to be used only as
  // an API server in conjunction with something like webpack-dev-server.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader(`Access-Control-Allow-Methods`, `GET, POST, PUT, DELETE, OPTIONS`);
  res.setHeader('Access-Control-Max-Age', 3600); // 1 hour
  // Disable caching so we'll always get the latest posts.
  res.setHeader('Cache-Control', 'no-cache');
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});