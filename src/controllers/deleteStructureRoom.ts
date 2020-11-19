import { validationResult } from "express-validator";

import queries from "../database/queries";
import dbAPI from "../database/database";
import { Request, Response } from "express";
import { Path } from "../model/Paths";

const deleteStructure = async (req: Request, res: Response) => {
  const { roomId } = req.body;
  console.log(roomId);
  //corroborate errors
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400);
  }
  try {
    const trx = await dbAPI.start();
    const beds = await queries.returnBedsOfAnyRoomForId(roomId, trx);
    dbAPI.commit(trx);
    console.log(beds);

    if (beds.length === 0) {
      queries
        .remove("room", "id", roomId)
        .then((ok) => console.log("borró bien?", ok));
    }
    res.json({ redirect: Path.ADMINSYS });
  } catch (error) {
    return res.status(400);
  }
};
export default deleteStructure;
