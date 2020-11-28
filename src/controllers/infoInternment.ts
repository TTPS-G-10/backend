import { Location, validationResult } from "express-validator";
import queries from "../DAL/queries";
import { Request, Response } from "express";
import { Internment } from "../model/Internment";
import { User } from "../model/User";
import { CustomRequest } from "../model/Request";
import { addSystemchangesAndEvaluationToInternment } from "../services/dataAggregation";

const infoInternment = async (req: Request, res: Response) => {
  console.log("llega", req.body);
  const user: User = (req as CustomRequest).user;
  if (user) {
    const idString = req.query.id as string;
    const id: number = parseInt(idString, 10);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("entro a los errores", errors);
      return res.sendStatus(400);
    }
    try {
      const internment:
        | Internment
        | null
        | undefined = await queries.findOpenInternmentWithPatientId(id);
      if (!internment) {
        console.log("the internment was not found");
        return res.sendStatus(404);
      }
      const patientLocation = await queries.LocationOfPatientWithPatientId(id);
      if (patientLocation) {
        if (
          user.systemId == patientLocation.systemId ||
          user.role == "JEFE DE SISTEMA"
        ) {
        } else {
          console.log(
            "you do not have permission to view internments from another system"
          );
          console.log(
            "your system",
            user.systemId,
            "patient system",
            patientLocation.systemId
          );
          return res.sendStatus(403);
        }
      }
      const internmentData = await addSystemchangesAndEvaluationToInternment(
        internment
      );

      res.json({ internmentData });
    } catch (error) {
      console.log("internmentid invalid");
      return res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
export default infoInternment;
