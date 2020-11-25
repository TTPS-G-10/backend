import { Location, validationResult } from "express-validator";
import queries from "../database/queries";
import { Request, Response } from "express";
import { User } from "../model/User";
import { CustomRequest } from "../model/Request";

const bedsWithSpaceForPatients = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  console.log("llega", req.body);
  if (true) {
    const idString = req.query.id as string;
    const id: number = parseInt(idString, 10);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("entro a los errores", errors);
      return res.sendStatus(400);
    }
    try {
      const beds = await queries.returnBedsWithSpaceOfRoomForRoomId(id);
      if (!beds) {
        console.log("the beds was not found, the system dont have free beds");
        return res.sendStatus(404);
      }
      res.json({ beds });
    } catch (error) {
      console.log("user invalid");
      return res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
export default bedsWithSpaceForPatients;
