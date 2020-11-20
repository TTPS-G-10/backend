import { validationResult } from "express-validator";

import queries from "../database/queries";
import dbAPI from "../database/database";
import { Request, Response } from "express";
import { FrontendPaths } from "../model/Paths";

const deleteStructure = async (req: Request, res: Response) => {
  const { bedId } = req.body;
  console.log(bedId);
  //corroborate errors
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400);
  }
  try {
    const patient = await queries.returnPatientForBed(bedId);
    if (patient == null) {
      await queries.remove("bed", "id", bedId);
      res.sendStatus(204);
    } else {
      res.sendStatus(400);
    }
  } catch (error) {
    return res.status(500);
  }
};
export default deleteStructure;
