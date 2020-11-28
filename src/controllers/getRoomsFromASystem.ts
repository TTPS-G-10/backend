import { validationResult } from "express-validator";
import queries from "../DAL/queries";
import { Request, Response } from "express";
import { ContactPerson } from "../model/ContactPerson";
import { User } from "../model/User";
import { CustomRequest } from "../model/Request";
import { Room } from "../model/Room";

const roomsFromASystem = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  if (user) {
    const idString = req.query.id as string;
    const id: number = parseInt(idString, 10);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendStatus(400);
    }
    try {
      const rooms:
        | Room
        | null
        | undefined = await queries.findRoomsFromASystemtByID(id);
      if (!rooms) {
        console.log("the Rooms was not found");
        return res.sendStatus(404);
      }
      console.log("rooms fo a system:", rooms);
      return res.json(rooms);
    } catch (error) {
      console.log("System ID invalid");
      return res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
export default roomsFromASystem;
