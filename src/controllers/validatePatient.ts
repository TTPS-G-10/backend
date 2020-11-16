import { validationResult } from "express-validator";
import queries from "../database/queries";
import dbAPI from "../database/database";
import { Request, Response } from "express";

const validatePatient = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("ERRORES DEL FORMULARIO PARA AGREGAR UN PACIENTE:", errors);
    return res.status(400);
  }
  try {
    console.log("me llega del front");

    console.log(req.body);
    //guardarlo en la DB;
    return res.json({ redirect: "/patient/id", data: {} });
  } catch (error) {
    console.log("no entiendo porque entre en el maldito error");
    return res.status(400);
  }
};
export default validatePatient;
