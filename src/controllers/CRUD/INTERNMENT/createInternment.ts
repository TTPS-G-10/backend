import { validationResult } from "express-validator";
import queries from "../../../DAL/queries";
import { Request, Response } from "express";
import { User } from "../../../model/User";
import { CustomRequest } from "../../../model/Request";
import { ServiceSystemNames } from "../../../model/SystemNames";

const createInternment = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  const system = await queries.findSystemForName(ServiceSystemNames.GUARDIA);
  if (!system) {
    console.log("the system was not found");
    return res.sendStatus(404);
  }
  if (user && user.systemId === system.id) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("parametro no valido");
      return res.sendStatus(400);
    }
    await queries
      .returCountFreeBedsInSystemId(system.id)
      .then(async (camas) => {
        console.log("camas", camas);

        if (camas[0].cantFree > 0) {
          return res.json({ redirect: "/internment/create", createBed: false });
        } else {
          await queries
            .returInfinitBedsOfSystem(system.id)
            .then((infinitBeds) => {
              if (infinitBeds[0].infinitBeds === 1) {
                console.log("crear internacion");
                return res.json({
                  redirect: "/internment/create",
                  createBed: true,
                });
              } else {
                console.log(
                  "the system dont not have beds and the infinit beds are disabled"
                );
                return res.sendStatus(500);
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
