import { validationResult } from "express-validator";
import queries from "../../../DAL/queries";
import { Request, Response } from "express";
import { User } from "../../../model/User";
import { CustomRequest } from "../../../model/Request";

const changeSystemchief = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  const { systemId, doctorId } = req.body;
  console.log("llego a crear assingnedDoctor", req.body);
  if (user) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("entro a los errores", errors);
      return res.sendStatus(400);
    }
    try {
      const systemChief = await queries.findSystemChiefBySystemId(systemId);
      if (!systemChief) {
        console.log("the actual systemChief was not found");
        return res.sendStatus(404);
      }
      const systemOfDoctor = await queries.findSystemOfUserForId(doctorId);
      if (!systemOfDoctor) {
        console.log("the doctor does not belong to the system");
        return res.sendStatus(404);
      }
      queries
        .changeRoleOfUserToDoctor(systemChief.id)
        .then((ok1) => {
          console.log("ok1", ok1);

          queries
            .changeRoleOfUserToSystemChief(doctorId)
            .then((ok2) => {
              console.log("ok2", ok2);
              queries.changePatientsOfUserToOtherUser(doctorId, systemChief.id);

              return res.sendStatus(201);
            })
            .catch(async () => {
              queries.changeRoleOfUserToSystemChief(systemChief.id);
              console.log("could not change the doctor assing of the patients");
              return res.sendStatus(500);
            });
        })
        .catch(async () => {
          console.log("could not change the role of the actual systemChief");
          return res.sendStatus(500);
        });
    } catch (error) {
      console.log("patient not found");
      return res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
export default changeSystemchief;
