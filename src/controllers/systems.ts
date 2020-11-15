import dbAPI from "../database/database";
import { Request, Response } from "express";
import { Room } from "../model/Room";
import { User } from "../model/User";
import { System } from "../model/System";
import queries from "../database/queries";
import { addRoomsAndBedsAndPatientsToSystem } from "../services/dataAggregation";

const systems = async (req: Request, res: Response) => {
  /**
   * read JWT to find user kind
   */
  const trx = await dbAPI.start();
  const user: User | null = await queries.findUserByEmail(
    "javier@gmail.com"
  );
  if (user) {
    try {
      const system = await queries.findSystemOfUser("javier@gmail.com", trx);

      user.systemId = system ? system.id : undefined;
      console.log(user.systemId);

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
      res.status(500);
    }
  } else {
    res.status(404);
  }
  dbAPI.commit(trx);
};
export default systems;
