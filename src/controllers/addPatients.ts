import { validationResult } from "express-validator";
import queries from "../database/queries";
import dbAPI from "../database/database";
import { Request, Response } from "express";
import { Patient } from "../model/Patient";

const addPatient = async (req: Request, res: Response) => {
  const { dni } = req.body;
  console.log("me llega del front");
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
    console.log("consulta de pacienteeee");
    console.log(patient);
    if (!patient) {
      console.log;
      return res.json({ redirect: "/addPatientData" });
    }
    //return res.json({ redirect: "/adminsys" });
  } catch (error) {
    console.log("no entiendo porque entre en el maldito error");
    return res.status(400);
  }
};
export default addPatient;
