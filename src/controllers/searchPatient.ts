import { validationResult } from "express-validator";
import queries from "../DAL/queries";
import { Request, Response } from "express";
import { Patient } from "../model/Patient";
import { User } from "../model/User";
import { CustomRequest } from "../model/Request";

const searchPatient = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  if (user) {
    const { dni } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("invalid DNI");
      return res.sendStatus(400);
    }
    try {
      const patient:
        | Patient
        | null
        | undefined = await queries.findPatientByDNI(dni);

      if (!patient) {
        return res.json({ redirect: "/patient/create" });
      }
      return res.json({ redirect: "/patient/" + patient.id });
    } catch (error) {
      console.log("err:", error);
      return res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
export default searchPatient;
