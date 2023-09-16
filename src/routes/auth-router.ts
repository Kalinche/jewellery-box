import { Router } from "express";
import { AppError } from "../model/errors";
import { UserRepository } from "../dao/user-repository";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { secret } from "../config/secret";
import Credentials from "../model/auth";

const authenticationRouter = Router();

// Auth API Feature
authenticationRouter.post("/login", async (req, res, next) => {

  const credentials = req.body as Credentials;

  try {
    const user = await (<UserRepository>req.app.locals.userRepo).getUserByUsername(
      credentials.username
    );
    if (!user) {
      throw new AppError(401, `Username or password is incorrect.`);
    }
    const passIsValid = await bcrypt.compare(
      credentials.password,
      user.password
    );
    if (!passIsValid && credentials.password != user.password) {
      throw new AppError(401, `Username or password is incorrect.`);
    }
    const token = jwt.sign({ id: user._id }, secret, {
      expiresIn: "1h", //expires in 1h
    });
    const { password, ...userWithoutPassword } = user;
    res.status(200).json({ token, userWithoutPassword });
  } catch (err) {
    next(err);
  }
});

authenticationRouter.post("/register", async (req, res, next) => {
  // validate new user
  console.log("Start registering a user");
  const newUser = req.body;

  try {
    const foundByUsername = await (<UserRepository>req.app.locals.userRepo).getUserByUsername(newUser.username);
    if (foundByUsername) {
      throw new AppError(409, `Username already taken.`);
    }

    const foundByEmail = await (<UserRepository>req.app.locals.userRepo).getUserByEmail(newUser.email);
    if (foundByEmail) {
      throw new AppError(409, `Email already registered.`);
    }

    // hash password
    newUser.password = await bcrypt.hash(newUser.password, 8);

    // Create new User
    const created = await (<UserRepository>req.app.locals.userRepo).addUser(
      newUser
    );

    res.status(201).location(`/users/${newUser.id}`).json(created);
  } catch (err) {
    next(err);
  }
});

export default authenticationRouter;