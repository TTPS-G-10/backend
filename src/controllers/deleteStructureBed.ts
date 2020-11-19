import { validationResult } from "express-validator";

import queries from "../database/queries";
import dbAPI from "../database/database";
import { Request, Response } from "express";
import { Path } from "../model/Paths";

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
    const trx = await dbAPI.start();
    const patient = await queries.returnPatientForBed(bedId, trx);
    dbAPI.commit(trx);
    if (patient == null) {
      queries
        .remove("bed", "id", bedId)
        .then((ok) => console.log("borró bien?", ok));
    }
    res.json({ redirect: Path.ADMINSYS });
  } catch (error) {
    return res.status(400);
  }
};
export default deleteStructure;
