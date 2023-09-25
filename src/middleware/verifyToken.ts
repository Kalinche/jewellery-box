import { NextFunction, Response } from "express";
import * as jwt from "jsonwebtoken";
import { secret } from "../config/secret";
import { Request } from "../model/common-types"

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ auth: false, message: "No token provided." });
  }

  let tokenToVerify = Array.isArray(token) ? token[0] : token;

  jwt.verify(tokenToVerify, secret, (err: any, decoded: any) => {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: "Failed to authenticate token." });
    }
    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
}
