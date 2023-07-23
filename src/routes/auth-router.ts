import { Router } from "express";
import { AppError } from "../model/errors";
import { UserRepository } from "../dao/user-repository";
import * as indicative from "indicative";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { secret } from "../config/secret";
import Credentials from "../model/auth";

const authenticationRouter = Router();

// Auth API Feature
authenticationRouter.post("/login", async (req, res, next) => {
  const db = req.app.locals.db;
  const credentials = req.body as Credentials;
  try {
    await indicative.validator.validate(credentials, {
      username: "required",
      password: "required|string|min:6",
    });
  } catch (err) {
    next(new AppError(400, (err as Error).message, err as Error));
    return;
  }
  try {
    const user = await (<UserRepository>req.app.locals.userRepo).getUserByUsername(
      credentials.username
    );
    if (!user) {
      next(new AppError(401, `Username or password is incorrect.`));
      return;
    }
    const passIsValid = await bcrypt.compare(
      credentials.password,
      user.password
    );
    if (!passIsValid) {
      next(new AppError(401, `Username or password is incorrect.`));
      return;
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
  const newUser = req.body;
  try {
    await indicative.validator.validate(newUser, {
      id: "regex:^[0-9a-fA-F]{24}$",
    });
  } catch (err) {
    next(new AppError(400, (err as Error).message, err as Error));
    return;
  }
  // create user in db
  try {
    const found = await (<UserRepository>(
      req.app.locals.userRepo
    )).getUserByUsername(newUser.username);
    if (found) {
      throw new AppError(400, `Username already taken: "${newUser.username}".`);
    }

    // hash password
    newUser.password = await bcrypt.hash(newUser.password, 8);

    // Create new User
    const created = await (<UserRepository>req.app.locals.userRepo).addUser(
      newUser
    );

    res.status(201).location(`/api/users/${newUser.id}`).json(created);
  } catch (err) { 
    next(err);
  }
});

export default authenticationRouter;