import dbAPI from "../database/database";
import { Request, Response } from "express";
import { Room } from "../model/Room";
import { User } from "../model/User";
import { System } from "../model/System";
import queries from "../database/queries";
import { addRoomsAndBedsAndPatientsToSystem } from "../services/dataAggregation";
import { CustomRequest } from "../model/Request";

const systems = async (req: Request, res: Response) => {
  /**
   * read JWT to find user kind
   */
  const trx = await dbAPI.start();
  const user: User = (req as CustomRequest).user;
  if (user) {
    try {
      const AllSystems = await queries.returnSystems(trx);
      if (AllSystems) {
        const systems = await Promise.all(
          AllSystems.map(addRoomsAndBedsAndPatientsToSystem)
        );

        res.json({ user, systems: systems });
      } else {
        res.json({ user });
      }
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
  dbAPI.commit(trx);
};
export default systems;
