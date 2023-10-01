import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import { secret } from "../config/secret";
import { Request } from "../model/common-types"

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).send({ auth: false, message: "No token provided or invalid format." });
  }

  const token = authHeader.slice(7);

  jwt.verify(token, secret, (err: any, decoded: any) => {
    if (err) {
      return res
        .status(401)
        .send({ auth: false, message: "Failed to authenticate token." });
    }
    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
}
