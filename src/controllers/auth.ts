import queries from "../DAL/queries";
import { Request, Response } from "express";
import { User, Role } from "../model/User";
import * as fs from "fs";
import * as path from "path";
import jwt from "jsonwebtoken";
import md5 from "md5";
import { FrontendPaths } from "../model/Paths";

const auth = async (req: Request, res: Response) => {
  console.log("entro al auth");
  const { email, password } = req.body;
  try {
    const user: User | null = await queries.findUserByEmail(email);
    console.log("se fue a buscar al user", user);
    if (!user) {
      return res.sendStatus(403);
    } else {
      // we know md5 isn't best way to do this, we let this way for convenience
      const validatePassword = md5(password) === user.password;
      if (!validatePassword) {
        console.log("invalid password");
        res.sendStatus(403);
      } else {
        console.log("usuario", user);

        if (user.role == Role.Doctor || user.role == Role.SystemChief) {
          const system = await queries.findSystemOfUser(email);
          user.systemId = system ? system.id : undefined;
          user.systemName = system ? system.name : undefined;
        }
        delete user.password;
        const privateKey = fs.readFileSync(
          //path.resolve(__dirname, "../../.certificates/private_key.pem")
          path.resolve("src/certificates/private_key.pem")
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
        switch (user.role) {
          case Role.Admin:
            console.log(
              "usuario _____--__________--------------___________-----------",
              user,
              "jwt",
              token
            );

            res.json({ redirect: FrontendPaths.ADMINSYS, user, jwt: token });
            break;
          case Role.Doctor:
            res.json({ redirect: FrontendPaths.PATIENTS, user, jwt: token });
            break;
          case Role.SystemChief:
            res.json({ redirect: FrontendPaths.SYSTEMS, user, jwt: token });
            break;
          default:
            //ruta para rules

            break;
        }
      }
    }
  } catch (error) {
    console.error(error);
    return res.sendStatus(500);
  }
};
export default auth;
