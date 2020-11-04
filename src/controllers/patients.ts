import dbAPI from "../database/database";
import { Request, Response } from "express";
import { Room } from "../model/Room";
import { User } from "../model/User";
import queries from "../database/queries";
import { addPatientsToRoom } from "../services/dataAggregation";

const patients = async (req: Request, res: Response) => {
  /**
   * read JWT to find user kind
   */
  const trx = await dbAPI.start();
  const user: User | null = await queries.findUserByEmail(
    "javier@gmail.com",
    trx
  );
  if (user) {
    try {
      const system = await queries.findSystemOfUser("javier@gmail.com", trx);
      user.system = system ? system : undefined;
      const rooms = await queries.returnRomsOfAnSystemForName(user.system as string, trx);
      const roomsWithPatients = await Promise.all(rooms.map(addPatientsToRoom));
      res.json({ user, rooms: roomsWithPatients });
    } catch (err) {
      console.error(err);
      res.status(500);
    }
  } else {
    res.status(404);
  }
  dbAPI.commit(trx);
}
export default patients;
