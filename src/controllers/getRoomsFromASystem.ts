import { validationResult } from "express-validator";
import queries from "../DAL/queries";
import { Request, Response } from "express";
import { ContactPerson } from "../model/ContactPerson";
import { User } from "../model/User";
import { CustomRequest } from "../model/Request";
import { Room } from "../model/Room";

const roomsFromASystem = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  const { systemName } = req.query;

  if (user) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendStatus(400);
    }
    try {
      const system = await queries.findSystemForName(systemName as string);
      if (!system) {
        console.log("sale `pr aca,,");
        console.log("the system was not found");
        return res.sendStatus(404);
      }

      const rooms:
        | Room
        | null
        | undefined = await queries.findRoomsFromASystemtByID(system.id);
      if (!rooms) {
        console.log("the Rooms was not found");
        return res.sendStatus(404);
      }
      console.log("rooms for a system:", rooms);
      return res.json({ rooms: rooms });
    } catch (error) {
      console.log("System ID invalid");
      return res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
export default roomsFromASystem;
