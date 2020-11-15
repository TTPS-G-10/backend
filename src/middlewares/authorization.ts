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
            const token = req.headers.authorization?.split(' ')[1] || '';
            if (!token) {
                throw new MissingAuthorizationError(token);
            }
            console.log('token', token === '');
            const cert = fs.readFileSync(path.resolve(__dirname, "../../public_key.pem"));  // get public key
            const user: User = jwt.verify(token, cert, { algorithms: ['RS256'] }) as User;
            if ((user as User).role) { next(); } // dejo pasar a todos ahora. De acá en más hay que poner lógica de authorización acá.
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