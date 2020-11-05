import dbAPI from "../database/database";
import { Request, Response } from "express";
import { Room } from "../model/Room";
import { User } from "../model/User";
import { System } from "../model/System";
import queries from "../database/queries";
import { addRoomsAndPatientsToSystem } from "../services/dataAggregation";

const systems = async (req: Request, res: Response) => {
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

      user.system = system ? system.name : undefined;
      console.log(user.system);

      const AllSystems = await queries.returnSystems(trx);
      if (AllSystems) {
        const systems = await Promise.all(
          AllSystems.map(addRoomsAndPatientsToSystem)
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
