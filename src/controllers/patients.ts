import dbAPI from "../database/database";
import { Request, Response } from "express";
import { Room } from "../model/Room";
import { User } from "../model/User";
import queries from "../database/queries";
import { addBedsAndPatientsToRoom } from "../services/dataAggregation";
import { CustomRequest } from "../model/Request";

const patients = async (req: Request, res: Response) => {
  /**
   * read JWT to find user kind
   */
  const trx = await dbAPI.start();
  const user: User = (req as CustomRequest).user;
  if (user) {
    try {
      const system = await queries.findSystemOfUser(user.email, trx);
      user.systemId = system ? system.id : undefined;
      console.log(user.systemId);
      
      const rooms = await queries.returnRomsOfAnSystemForId(
        user.systemId as number,
        trx
      );
      const roomsWithPatients = await Promise.all(rooms.map(addBedsAndPatientsToRoom));
      res.json({ user, rooms: roomsWithPatients });
    } catch (err) {
      console.error(err);
      res.status(500);
    }
  } else {
    res.status(404);
  }
  dbAPI.commit(trx);
};
export default patients;
