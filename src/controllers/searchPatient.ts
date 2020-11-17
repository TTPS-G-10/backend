import { validationResult } from "express-validator";
import queries from "../database/queries";
import dbAPI from "../database/database";
import { Request, Response } from "express";
import { Patient } from "../model/Patient";
import { ContactPerson } from "../model/ContactPerson";

const addPatient = async (req: Request, res: Response) => {
  const { dni } = req.body;
  console.log("me llega del front el dni del paciente:");
  console.log(req.body);
  //corroborate errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).send("DNI no valido");
  }
  try {
    const trx = await dbAPI.start();
    const patient: Patient | null | undefined = await queries.findPatientByDNI(
      dni,
      trx
    );
    await dbAPI.commit(trx);
    console.log("consulta de pacienteeee:");
    console.log(patient);
    if (!patient) {
      return res.json({ redirect: "/patient/create" });
    }
    //the patient is registered in the system
    const contact:
      | ContactPerson
      | null
      | undefined = await queries.findContactPersonByPatientID(patient.id, trx);
    await dbAPI.commit(trx);
    console.log("consulta de la persona de contacto:");
    console.log(contact);
    const contactPerson = { ...contact };
    const data = { ...patient, contactPerson: contactPerson };
    console.log("data:", data);
    return res.json({ redirect: "/patient/" + data.id, data: data });
  } catch (error) {
    return res.status(500).send("upps! algo salio mal :(");
  }
};
export default addPatient;
