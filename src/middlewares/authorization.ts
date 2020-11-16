import { NextFunction, Response, Request } from "express";
import * as fs from "fs";
import * as path from "path";
import jwt from 'jsonwebtoken';
import { User } from "../model/User";
import MissingAuthorizationError from "../model/Errors";
const authorization = (req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/authenticate' || req.headers['unsecure']) {
        next();
    } else {
        try {
            // search jwt by header or cookie
            const token = req.headers.authorization?.split(' ')[1] || req.cookies.jwt;
            if (!token) {
                throw new MissingAuthorizationError(token);
            }
            const cert = fs.readFileSync(path.resolve(__dirname, "../../public_key.pem"));  // get public key
            const { user } = jwt.verify(token, cert, { algorithms: ['RS256'] }) as { user: User, iat: number };
            if ((user as User).role) {
                next();
            } else {
                console.log(user);
                res.sendStatus(401);
            }
        }
        catch (error) {
            if (error.hasOwnProperty('token')) {
                res.sendStatus(401);
            }
            else {
                res.sendStatus(500);
            }
        };
    }
};
export default authorization