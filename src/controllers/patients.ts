import { Request, Response } from "express";
import { User } from "../model/User";
import queries from "../database/queries";
import { addBedsAndPatientsToRoom } from "../services/dataAggregation";
import { CustomRequest } from "../model/Request";

const patients = async (req: Request, res: Response) => {
  /**
   * return rooms with patients
   */
  const user: User = (req as CustomRequest).user;
  if (user) {
    try {
      const system = await queries.findSystemOfUser(user.email);
      user.systemId = system ? system.id : undefined;
      const rooms = await queries.returnRomsOfAnSystemForId(
        user.systemId as number
      );
      const roomsWithPatients = await Promise.all(
        rooms.map(addBedsAndPatientsToRoom)
      );
      res.json({ user, rooms: roomsWithPatients });
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
export default patients;
