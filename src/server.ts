import express from 'express';
import { ObjectId } from 'mongodb';
import { userRepository } from './dao/user-repository';
import { User, validateUser } from './model/user.model';
import authenticationRouter from './routes/auth-router';
import cors from 'cors';

const app = express();

const port = 2704;

app.use(cors());

app.use('/auth', authenticationRouter);
app.use()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

// User routes
app.route("/users").get(async (req, res) => {
  const username = req.query.username;
  if (username) {
    const user = await userRepository.getUserByUsername(username as string);
    console.log("Getting user by username: ");
    console.log(user);
    res.json(user);
  } else {
    const users = await userRepository.getAllUsers();
    res.json(users);
  }
}).post(async (req, res) => {
  const user = req.body as User;
  const problems = validateUser(user);
  if (problems.length === 0) {
    const newId = await userRepository.addUser(user);
    res.status(201);
    res.json(newId);
  } else {
    res.status(400);
    res.json(problems);
  }
});

app.route("/users/:userId").get(async (req, res) => {
  const user = await userRepository.getUser(new ObjectId(req.params.userId));
  if (user) {
    console.log("Getting user by _id: ");
    console.log(user);
    res.json(user);
  } else {
    res.sendStatus(404);
  }
}).put(async (req, res) => {
  console.log("Updating user: ");
  const problems = validateUser(req.body);
  if (problems.length === 0) {
    const id = req.body._id;
    // The id converts to string when send/receiving requests, so we want to convert it back to ObjectId
    const result = await userRepository.updateUser({ ...req.body, _id: new ObjectId(id) });
    if (result.modifiedCount === 0) {
      res.status(404);
    }
    res.json(result);
  } else {
    res.status(400);
    res.json(problems);
  }
}).delete(async (req, res) => {
  const result = await userRepository.deleteUser(new ObjectId(req.params.userId));
  if (result.deletedCount === 0) {
    res.status(404);
  }
  res.json(result);
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
