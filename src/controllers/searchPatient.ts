import { validationResult } from "express-validator";
import queries from "../database/queries";
import dbAPI from "../database/database";
import { Request, Response } from "express";
import { Patient } from "../model/Patient";
import { User } from "../model/User";
import { CustomRequest } from "../model/Request";

const searchPatient = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  console.log("llego al controller");
  if (user) {
    console.log("entro porque hay un usuario logeado");
    const { dni } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("dni no valido");
      return res.sendStatus(400).send("algo salio mal");
    }
    try {
      const trx = await dbAPI.start();
      const patient:
        | Patient
        | null
        | undefined = await queries.findPatientByDNI(dni, trx);
      await dbAPI.commit(trx);
      if (!patient) {
        console.log("entro para crear un nuevo usuario");
        return res.json({ redirect: "/patient/create" });
      }
      console.log("entro para mostrar usuario");
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
