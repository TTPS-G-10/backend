import { validationResult } from "express-validator";
import queries from "../DAL/queries";
import { Request, Response } from "express";
import { User } from "../model/User";
import { CustomRequest } from "../model/Request";

const patientsOfUser = async (req: Request, res: Response) => {
  console.log("llega", req.body);
  const user: User = (req as CustomRequest).user;
  if (user) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("entro a los errores", errors);
      return res.sendStatus(400);
    }
    try {
      const patients = await queries.returnPatientsAssinedToUserById(user.id);
      if (!patients) {
        console.log("the patients was not found");
        return res.sendStatus(404);
      }
      console.log(patients);
      return res.json({ patients });
    } catch (error) {
      console.log("patients not found");
      return res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
export default patientsOfUser;
