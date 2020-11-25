import { validationResult } from "express-validator";
import queries from "../../../DAL/queries";
import { Request, Response } from "express";

const deleteStructure = async (req: Request, res: Response) => {
  const { bedId } = req.body;
  console.log(bedId);
  //corroborate errors
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.sendStatus(400);
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
