import { validationResult } from "express-validator";
import queries from "../DAL/queries";
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
      return res.sendStatus(400);
    }
    try {
      const patient: Patient | null | undefined = await queries.findPatientByID(
        id
      );
      if (!patient) {
        console.log("the patient was not found");
        return res.sendStatus(404);
      }
      const contact:
        | ContactPerson
        | null
        | undefined = await queries.findContactPersonByPatientID(patient.id);

      const contactPerson = { ...contact };
      const data = { ...patient, contactPerson: contactPerson };
      return res.json(data);
    } catch (error) {
      console.log("DNI invalid");
      return res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
export default infoPatient;
