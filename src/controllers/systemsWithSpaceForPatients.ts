import { Location, validationResult } from "express-validator";
import queries from "../DAL/queries";
import { Request, Response } from "express";
import { User } from "../model/User";
import { CustomRequest } from "../model/Request";

const systemsWithSpaceForPatients = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  if (user) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("entro a los errores", errors);
      return res.sendStatus(400);
    }
    try {
      const systems = await queries.returnSystemsWithSpace();
      if (!systems) {
        console.log("the systems was not found");
        return res.sendStatus(404);
      }
      res.json({ systems });
    } catch (error) {
      console.log("user invalid");
      return res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
export default systemsWithSpaceForPatients;
