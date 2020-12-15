import { Location, validationResult } from "express-validator";
import queries from "../../../DAL/queries";
import { Request, Response } from "express";
import { User } from "../../../model/User";
import { CustomRequest } from "../../../model/Request";

const infoInternments = async (req: Request, res: Response) => {
  console.log("llega a internmentss");
  const user: User = (req as CustomRequest).user;
  if (user) {
    const patientId: number = parseInt(req.query.patientId as string, 10);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("entro a los errores", errors);
      return res.sendStatus(400);
    }
    try {
      const internments = await queries.patienInternmentsByPatientId(patientId);
      if (!internments) {
        console.log("the internments was not found");
        return res.sendStatus(404);
      }

      res.json({ internments });
    } catch (error) {
      console.log("patient id is invalid");
      return res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
export default infoInternments;
