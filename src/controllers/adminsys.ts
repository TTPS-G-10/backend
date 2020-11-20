import dbAPI from "../database/database";
import { Request, Response } from "express";
import { Room } from "../model/Room";
import { User } from "../model/User";
import { System } from "../model/System";
import queries from "../database/queries";
import { addRoomsAndBedsToSystem } from "../services/dataAggregation";

const adminsys = async (req: Request, res: Response) => {
  try {
    const AllSystems = await queries.returnSystems();
    if (AllSystems) {
      const systems = await Promise.all(
        AllSystems.map(addRoomsAndBedsToSystem)
      );
      res.json({ systems });
    } else {
      res.sendStatus(404);
    }
  } catch (err) {
    console.error(err);
    res.status(500);
  }
};
export default adminsys;
