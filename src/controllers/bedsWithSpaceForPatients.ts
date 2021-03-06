import { validationResult } from "express-validator";
import queries from "../DAL/queries";
import { Request, Response } from "express";
import { User } from "../model/User";
import { CustomRequest } from "../model/Request";

const bedsWithSpaceForPatients = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  if (user) {
    const idString = req.query.id as string;
    const id: number = parseInt(idString, 10);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("errors", errors);
      return res.sendStatus(400);
    }
    try {
      const beds = await queries.returnBedsWithSpaceOfRoomForRoomId(id);
      console.log("------- EN bedsWithSpaceForPatients: BEDS:", beds);
      if (!beds) {
        console.log("the beds was not found, the system dont have free beds");
        return res.sendStatus(404);
      }
      res.json(beds);
    } catch (error) {
      console.log("user invalid");
      return res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
export default bedsWithSpaceForPatients;
