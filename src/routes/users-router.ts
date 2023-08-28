import { Router } from "express";
import { AppError } from "../model/errors";
import { UserRepository } from "../dao/user-repository";
import * as indicative from "indicative";
import * as bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { verifyToken } from "../middleware/verifyToken";

const userRouter = Router();

userRouter.get("/", verifyToken, (req, res, next) =>
  // TODO: make available only for admins
  (<UserRepository>req.app.locals.userRepo)
    .getAllUsers()
    .then((users) =>
      res.json(
        users.map(({ password, ...rest }) => {
          return rest;
        })
      )
    )
    .catch(next)
);

userRouter.get("/:id", verifyToken, async (req, res, next) => {
  console.log("Getting the user with id: " + req.params.id);
  try {
    const id = req.params.id;
    await indicative.validator.validate(
      { id },
      {
        id: "required|regex:^[0-9a-fA-F]{24}$",
      }
    );
  } catch (err) {
    next(new AppError(400, (err as Error).message, err as Error));
    return;
  }
  // find user
  try {
    const found = await (<UserRepository>req.app.locals.userRepo).getUser(
      new ObjectId(req.params.id)
    );
    res.json(found);
  } catch (err) {
    next(err);
  }
});

userRouter.post("/", verifyToken, async (req, res, next) => {
  // TODO: make available only for admins
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
      throw new AppError(400, `Username already taken: '${newUser.username}'.`);
    }

    // hash password
    newUser.password = await bcrypt.hash(newUser.password, 8);

    // Create new User
    const created = await (<UserRepository>req.app.locals.userRepo).addUser(
      newUser
    );

    res.status(201).location(`/${newUser.id}`).json(created);
  } catch (err) {
    next(err);
  }
});

userRouter.delete("/:id", verifyToken, async function (req, res, next) {
  // TODO: make available only for admins

  // validate id
  try {
    const id = req.params.id;
    await indicative.validator.validate(
      { id },
      {
        id: "required|regex:^[0-9a-fA-F]{24}$",
      }
    );
  } catch (err) {
    next(new AppError(400, (err as Error).message, err as Error));
    return;
  }
  try {
    const userId = req.params.id;
    const deleted = await (<UserRepository>req.app.locals.userRepo).deleteUser(
      new ObjectId(userId)
    );

    res.json(deleted); //200 OK with deleted user in the body
  } catch (err) {
    next(err);
  }
});

export default userRouter;