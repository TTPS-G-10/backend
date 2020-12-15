import { validationResult } from "express-validator";
import queries from "../../../DAL/queries";
import { Request, Response } from "express";
import { User } from "../../../model/User";
import { CustomRequest } from "../../../model/Request";

const doctorsOfSystem = async (req: Request, res: Response) => {
  console.log("llega", req.body);
  const user: User = (req as CustomRequest).user;
  if (user) {
    const id: number = parseInt(req.query.id as string, 10);
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.log("entro a los errores", errors);
      return res.sendStatus(400);
    }
    try {
      const patientLocation = await queries.LocationOfPatientWithPatientId(id);
      if (patientLocation) {
        if (user.systemId == patientLocation.systemId) {
          const doctors = await queries.returnDoctorsOfSystemForId(
            patientLocation.systemId
          );
          if (!doctors) {
            console.log("the doctors was not found");
            return res.sendStatus(404);
          }
          res.json({ doctors });
        } else {
          console.log(
            "you do not have permission to assing doctors to patient from another system"
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
    } catch (error) {
      console.log("patient not found");
      return res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
export default doctorsOfSystem;
