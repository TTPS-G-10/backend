import { validationResult } from "express-validator";
import queries from "../database/queries";
import dbAPI from "../database/database";
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
      return res.status(400);
    }
    try {
      const trx = await dbAPI.start();
      const patient:
        | Patient
        | null
        | undefined = await queries.findPatientByDNI(dni, trx);
      await dbAPI.commit(trx);
      if (!patient) {
        return res.json({ redirect: "/patient/create" });
      }
      return res.json({ redirect: "/patient/" + patient.id });
    } catch (error) {
      return res.status(500);
    }
  } else {
    res.status(404);
  }
};
export default searchPatient;
