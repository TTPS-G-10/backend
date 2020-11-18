import { validationResult } from "express-validator";
import queries from "../database/queries";
import dbAPI from "../database/database";
import { Request, Response } from "express";
import { User, Role } from "../model/User";
import * as fs from "fs";
import * as path from "path";
import jwt from "jsonwebtoken";
import md5 from "md5";
import { Path } from "../model/Paths";

const auth = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user: User | null = await queries.findUserByEmail(email);

    if (!user) {
      return res.status(403).send({ error: "Usuario no registrado" });
    } else {
      // we know md5 isn't best way to do this, we let this way for convenience
      const validatePassword = md5(password) === user.password;
      if (!validatePassword) {
        res.sendStatus(403);
      } else {
        delete user.password;
        const privateKey = fs.readFileSync(
          path.resolve(__dirname, "../../.certificates/private_key.pem")
        );
        const token = jwt.sign(
          { user },
          { key: privateKey, passphrase: "ttps10" },
          { algorithm: "RS256" }
        );
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: true,
          maxAge: 2147483647,
        });
        // all ok
        if (user.role == Role.Admin) {
          res.json({ redirect: Path.ADMINSYS, user, jwt: token });
        }
        if (user.role == Role.Doctor) {
          const trx = await dbAPI.start();
          const system = await queries.findSystemOfUser(email, trx);
          user.systemId = system ? system.id : undefined;
          user.systemName = system ? system.name : undefined;
          dbAPI.commit(trx);
          res.json({ redirect: Path.PATIENTS, user, jwt: token });
        }
        if (user.role == Role.SystemChief) {
          const trx = await dbAPI.start();
          const system = await queries.findSystemOfUser(email, trx);
          user.systemId = system ? system.id : undefined;
          user.systemName = system ? system.name : undefined;
          dbAPI.commit(trx);
          res.json({ redirect: Path.SYSTEMS, user, jwt: token });
        }
      }
    }
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};
export default auth;
