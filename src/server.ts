import express from 'express';
import { MongoClient } from 'mongodb';
import { UserRepository } from './dao/user-repository';
import authenticationRouter from './routes/auth-router';
import userRouter from './routes/users-router';

const app = express()

const port = 2704
const DB_URL = 'mongodb://localhost:27017/'; // your MongoDB URL here
const DB_NAME = 'myDbName'; // your database name here

let connection: MongoClient;

async function start() {
  const db = await initDb(DB_URL, DB_NAME);
  const userRepo = new UserRepository(db, 'users'); // assuming UserRepository takes db and collection name

  app.locals.userRepo = userRepo;

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // Additional middleware which will set headers that we need on each request.
  app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, Host, Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.setHeader('Access-Control-Max-Age', 3600); // 1 hour
    // Disable caching so we'll always get the latest posts.
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

  app.use('/', authenticationRouter)
  app.use('/', userRouter)

  app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
  })
}

async function initDb(mongoUrl: string, dbName: string) {
  // connect to mongodb
  connection = await MongoClient.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
  return connection.db(dbName);
}

start();
