import { validationResult } from "express-validator";
import queries from "../database/queries";
import { Request, Response } from "express";
import { User } from "../model/User";
import { CustomRequest } from "../model/Request";

const validatePatient = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;

  if (user && user.systemId === 1) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.sendStatus(400);
    }
    await queries
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
      .then(async (ok) => {
        const idPatient = ok[0].insertId;
        await queries
          .insertContactPerson("INSERT INTO `contactPerson`", {
            name: req.body.contactPerson_name,
            lastName: req.body.contactPerson_lastName,
            relationship: req.body.contactPerson_relationship,
            phone: req.body.contactPerson_phone,
            patientId: idPatient,
          })
          .then(() => {
            return res.json({
              redirect: "/patient/" + idPatient,
            });
          })
          .catch(() => {
            console.log(
              "Contact person was not inserted. Patient data uploaded in the system, but not those of contact persons"
            );
            return res.sendStatus(500);
          });
      })
      .catch(() => {
        console.log("the patient was not inserted into the system");
        return res.sendStatus(500);
      });
  } else {
    res.sendStatus(403);
  }
};
export default validatePatient;
