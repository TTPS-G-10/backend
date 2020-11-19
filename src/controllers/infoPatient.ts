import { validationResult } from "express-validator";
import queries from "../database/queries";
import dbAPI from "../database/database";
import { Request, Response } from "express";
import { Patient } from "../model/Patient";
import { ContactPerson } from "../model/ContactPerson";
import { User } from "../model/User";
import { CustomRequest } from "../model/Request";

const infoPatient = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  if (user) {
    const idString = req.query.id as string;
    const id: number = parseInt(idString, 10);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400);
    }
    try {
      const trx = await dbAPI.start();
      const patient: Patient | null | undefined = await queries.findPatientByID(
        id,
        trx
      );
      await dbAPI.commit(trx);
      if (!patient) {
        return res.status(404);
      }
      const contact:
        | ContactPerson
        | null
        | undefined = await queries.findContactPersonByPatientID(
        patient.id,
        trx
      );
      await dbAPI.commit(trx);
      const contactPerson = { ...contact };
      const data = { ...patient, contactPerson: contactPerson };
      return res.json(data);
    } catch (error) {
      return res.status(500);
    }
  } else {
    res.status(404);
  }
};
export default infoPatient;
