import dbAPI from "../database/database";
import { Request, Response } from "express";
import queries from "../database/queries";
import { addRoomsAndBedsAndPatientsToSystem } from "../services/dataAggregation";

const systems = async (req: Request, res: Response) => {
  const trx = await dbAPI.start();
  try {
    const AllSystems = await queries.returnSystems(trx);
    dbAPI.commit(trx);
    if (AllSystems) {
      const systems = await Promise.all(
        AllSystems.map(addRoomsAndBedsAndPatientsToSystem)
      );
      res.json({ systems: systems });
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error(err);
    res.status(500);
  }
};
export default systems;
