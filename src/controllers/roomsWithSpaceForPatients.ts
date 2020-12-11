import { validationResult } from "express-validator";
import queries from "../DAL/queries";
import { Request, Response } from "express";
import { User } from "../model/User";
import { CustomRequest } from "../model/Request";

const roomsWithSpaceForPatients = async (req: Request, res: Response) => {
  console.log("llego a rooms with space for patients", req.query);
  const user: User = (req as CustomRequest).user;
  if (user) {
    const systemName = req.query.systemName as string;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("invalid params", errors);
      return res.sendStatus(400);
    }
    try {
      console.log(systemName);

      const system = await queries.findSystemForName(systemName);
      if (!system) {
        console.log("the system was not found");
        return res.sendStatus(404);
      }
      const rooms = await queries.returnRoomsWithSpaceOfSystemForSystemId(
        system.id
      );
      console.log(rooms);
      if (!rooms) {
        console.log("the rooms was not found, the system dont have free beds");
        return res.sendStatus(404);
      }
      console.log("rooms with space", rooms);
      let validRooms = true;
      if (rooms.length === 0) {
        validRooms = false;
      }
      res.json({ rooms, validRooms });
    } catch (error) {
      console.log("user invalid");
      return res.sendStatus(403);
    }
  } else {
    res.sendStatus(404);
  }
};
export default roomsWithSpaceForPatients;
