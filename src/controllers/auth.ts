import { validationResult } from "express-validator";
import queries from "../database/queries";
import dbAPI from "../database/database";
import { Request, Response } from "express";
import { User } from "../model/User";
import * as fs from "fs";
import * as path from "path";
import jwt from 'jsonwebtoken';


const auth = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log(req.body);

  //corroborate errors
  /*   const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);
      return res.status(400).send("Email o Contraseña incorrecta");
    } */
  try {
    /**
     * call DB lookup for user
     *  if succeed -> 200 and redirect page
     *  if failure -> 403 FORBIDDEN
     */
    const user: User | null = await queries.findUserByEmail(email);

    if (!user) {
      return res.status(403).send({ error: "Usuario no registrado" });
    } else {
      const privateKey = fs.readFileSync(path.resolve(__dirname, "../../private_key.pem"));
      const token = jwt.sign({ user }, { key: privateKey, passphrase: 'ttps10' }, { algorithm: 'RS256' });

      // all ok
      if (user.role == "ADMIN") {
        res.json({ redirect: "/adminsys", user, jwt: token });
      }
      if (user.role == "DOCTOR") {
        const trx = await dbAPI.start();
        const system = await queries.findSystemOfUser(email, trx);
        user.systemId = system ? system.id : undefined;
        dbAPI.commit(trx);

        res.json({ redirect: "/patients", user, jwt: token });
      }
      if (user.role == "ADMIN") {
        res.json({ redirect: "/adminsys", user, jwt: token });
      }
      if (user.role == "ADMIN") {
        res.json({ redirect: "/adminsys", user, jwt: token });
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500);
  }
};
export default auth;
