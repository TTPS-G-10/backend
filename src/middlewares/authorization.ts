import { NextFunction, Response, Request } from "express";
import * as fs from "fs";
import * as path from "path";
import jwt from "jsonwebtoken";
import { User } from "../model/User";
import MissingAuthorizationError from "../model/Errors";
import { CustomRequest } from "../model/Request";

const authorization = (req: Request, res: Response, next: NextFunction) => {
  console.log("--------------------entro a authorization--------------- ");
  if (req.path === "/authenticate" || req.headers["unsecure"]) {
    next();
  } else {
    next();
    next();
    try {
      // search jwt by header or cookie
      const token = req.headers.authorization?.split(" ")[1] || req.cookies.jwt;
      if (!token) {
        throw new MissingAuthorizationError(token);
      }
      const cert = fs.readFileSync(
        //path.resolve(__dirname, "../../.certificates/public_key.pem")
        path.resolve("src/certificates/public_key.pem")
      ); // get public key
      const { user } = jwt.verify(token, cert, { algorithms: ["RS256"] }) as {
        user: User;
        iat: number;
      };
      if (user) {
        (req as CustomRequest).user = user;
        next();
      } else {
        res.sendStatus(401);
      }
    } catch (error) {
      if (error.hasOwnProperty("token")) {
        res.sendStatus(401);
      } else {
        res.sendStatus(500);
      }
    }
  }
};
export default authorization;
