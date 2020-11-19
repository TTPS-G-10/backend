import { validationResult } from "express-validator";
import queries from "../database/queries";
import { Request, Response } from "express";
import { User } from "../model/User";
import { CustomRequest } from "../model/Request";

const validatePatient = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;

  if (user) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("ERRORES DEL FORMULARIO PARA AGREGAR UN PACIENTE:", errors);
      return res.sendStatus(400);
    }
    queries
      .insertPatient("INSERT INTO `patient`", {
        name: req.body.name,
        lastName: req.body.lastName,
        dni: req.body.dni,
        birthDate: req.body.birthDate.slice(0, 10),
        direction: req.body.direction,
        phone: req.body.phone,
        email: req.body.email,
        socialSecurity: req.body.socialSecurity,
        backgroundClinical: req.body.background_clinical,
      })
      .then((ok) => {
        const idPatient = ok[0].insertId;
        queries
          .insertContactPerson("INSERT INTO `contactPerson`", {
            name: req.body.contactPerson_name,
            lastName: req.body.contactPerson_lastName,
            relationship: req.body.contactPerson_relationship,
            phone: req.body.contactPerson_phone,
            patientId: idPatient,
          })
          .then((okey) => {
            return res.json({
              redirect: "/patient/" + idPatient,
            });
          })
          .catch(() => {
            console.log(
              "no se inserto persona de contacto:  Algo salio mal al ingregar la persona de contacto.Datos del paciente cargados en el sistema, pero no los de las personas de contacto "
            );
            return res.sendStatus(500);
          });
      })
      .catch(() => {
        console.log(
          "no se inserto el paciente:Algo salio mal al ingresar el paciente. No se pudo ingresar sus datos al sistema"
        );
        return res.sendStatus(500);
      });
  } else {
    console.log(
      "no se inserto el paciente:Algo salio mal al ingresar el paciente. No se pudo ingresar sus datos al sistema"
    );
    res.sendStatus(404);
  }
};
export default validatePatient;
