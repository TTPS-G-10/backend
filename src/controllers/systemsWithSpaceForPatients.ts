import { validationResult } from "express-validator";
import queries from "../DAL/queries";
import { Request, Response } from "express";
import { User } from "../model/User";
import { Location } from "../model/Location";
import SystemChangesRules from "../systemPass.json";
import { CustomRequest } from "../model/Request";

const systemsWithSpaceForPatients = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  if (user) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("entro a los errores", errors);
      return res.sendStatus(400);
    }
    const id: number = parseInt(req.query.id as string, 10);
    try {
      const location:
        | Location
        | null
        | undefined = await queries.LocationOfPatientWithPatientId(id);
      if (!location) {
        console.log("the patient was not found");
        return res.sendStatus(404);
      }

      const allowedSystems = (SystemChangesRules as any)[location.systemName];
      res.json({ allowedSystems });
    } catch (error) {
      console.log("user invalid");
      return res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
export default systemsWithSpaceForPatients;
