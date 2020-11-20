import { validationResult } from "express-validator";
import queries from "../database/queries";
import { Request, Response } from "express";

const deleteStructure = async (req: Request, res: Response) => {
  const { systemId } = req.body;

  //corroborate errors
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.sendStatus(400);
  }
  try {
    const rooms = await queries.returnBedsOfAnyRoomForId(systemId);
    const sistemChanges = await queries.returnRomsOfAnSystemForId(systemId);
    const sc = sistemChanges ? sistemChanges.length : 0;
    const rm = rooms ? rooms.length : 0;
    if (rm === 0 && sc === 0) {
      await queries.remove("`system`", "id", systemId);
      res.sendStatus(204);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    return res.status(500);
  }
};
export default deleteStructure;
