import { validationResult } from "express-validator";
import queries from "../database/queries";
import { Request, Response } from "express";
import { User } from "../model/User";
import { CustomRequest } from "../model/Request";

const createInternment = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  console.log("llego a creat internament", req.query);
  if (user && user.systemId === 1) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("parametro no valido");
      return res.sendStatus(400);
    }
    await queries
      .returCountFreeBedsInSystemId(1)
      .then(async (camas) => {
        console.log("respuesta de cantidad de camas libres", camas[0].cantFree);
        if (camas[0].cantFree > 0) {
          console.log("entro por donde tien las camas libres");
          return res.json({ redirect: "/internment/create", createBed: false });
        } else {
          await queries.returInfinitBedsOfSystem(1).then((infinitBeds) => {
            console.log("respuesta decamas infinitas", infinitBeds[0]);
            if (infinitBeds[0].infinitBeds === 1) {
              console.log("crear internacion");
              return res.json({
                redirect: "/internment/create",
                createBed: true,
              });
            } else {
              return res.json({ redirect: "/internment/create" });
            }
          });
        }
      })
      .catch(() => {
        console.log("the internment could not be created");
        return res.sendStatus(500);
      });
  } else {
    res.sendStatus(403);
  }
};
export default createInternment;
