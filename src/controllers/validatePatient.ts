import { validationResult } from "express-validator";
import queries from "../database/queries";
import { Request, Response } from "express";

const validatePatient = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("ERRORES DEL FORMULARIO PARA AGREGAR UN PACIENTE:", errors);
    return res.status(400).send({
      error: "Se ingreso un campo incorrectamente ",
    });
  }
  console.log("me llega del front");
  console.log(req.body);
  const contactPerson = {
    name: req.body.contactPerson_name,
    lastName: req.body.contactPerson_lastName,
    relationship: req.body.contactPerson_relationship,
    phone: req.body.contactPerson_phone,
  };
  const data = {
    id: null,
    name: req.body.name,
    lastName: req.body.lastName,
    dni: req.body.dni,
    birthDate: req.body.birthDate.slice(0, 10),
    direction: req.body.direction,
    phone: req.body.phone,
    email: req.body.email,
    socialSecurity: req.body.socialSecurity,
    backgroundClinical: req.body.background_clinical,
    contactPerson: contactPerson,
  };
  //guardarlo en la DB el paciente;
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
      console.log("insertó paciente:", ok);
      //guardo la persona de contacto (Mundo ideal donde una persona de contacto soloe sta asociada a un paciente)
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
          data.id = idPatient;
          console.log("se inserto la persona de contacto:", okey);
          return res.json({
            redirect: "/patient/" + idPatient,
            data: data,
          });
        })
        .catch(() => {
          console.log("no se inserto persona de contacto:");
          return res.status(400).send({
            error:
              "Algo salio mal al ingregar la persona de contacto.Datos del paciente cargados en el sistema, pero no los de las personas de contacto ",
          });
        });
    })
    .catch(() => {
      console.log("no se inserto el paciente");
      return res.status(400).send({
        error:
          "Algo salio mal al ingresar el paciente. No se pudo ingresar sus datos al sistema ",
      });
    });
};
export default validatePatient;
