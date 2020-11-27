import { Location, validationResult } from "express-validator";
import queries from "../DAL/queries";
import { Request, Response } from "express";
import { User } from "../model/User";
import { CustomRequest } from "../model/Request";

const roomsWithSpaceForPatients = async (req: Request, res: Response) => {
  console.log("llego a rooms with space for patients", req.query);
  const user: User = (req as CustomRequest).user;
  if (user) {
    const idString = req.query.id as string;
    const id: number = parseInt(idString, 10);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("invalid params", errors);
      return res.sendStatus(400);
    }
    try {
      console.log("id:", idString, id);
      const rooms = await queries.returnRoomsWithSpaceOfSystemForSystemId(id);
      if (!rooms) {
        console.log("the rooms was not found, the system dont have free beds");
        return res.sendStatus(404);
      }
      console.log("rooms with space", rooms);
      res.json(rooms);
    } catch (error) {
      console.log("user invalid");
      return res.sendStatus(403);
    }
  } else {
    res.sendStatus(404);
  }
};
export default roomsWithSpaceForPatients;