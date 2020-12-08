import searchPatient from "../controllers/searchPatient";
import createPatient from "../controllers/CRUD/PATIENT/createPatient";
import infoPatient from "../controllers/infoPatient";
import { check, body } from "express-validator";
import { CustomRequest } from "../model/Request";
import { Role } from "../model/User";
import Router, { Response, NextFunction, Request } from "express";
import { ServicePaths } from "../model/Paths";
import Evolution from "../controllers/CRUD/EVOLUTION";
import validate from "../middlewares/validate";

const router = Router();

const checkPermissionByRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allowedRoles = [Role.Doctor, Role.SystemChief];
  if (allowedRoles.includes((req as CustomRequest).user.role)) {
    next();
  } else {
    res.sendStatus(403); // Forbidden
  }
};

router.post(
  ServicePaths.PATIENT,
  checkPermissionByRole,
  [
    check("dni", "The DNI is mandatory").not().isEmpty(),
    check("dni", "The DNI has to be a number").isNumeric(),
  ],
  searchPatient
);

router.get(
  ServicePaths.PATIENT,
  checkPermissionByRole,
  [check("id").not().isEmpty()],
  infoPatient
);

router.post(
  ServicePaths.PATIENT_EVOLVE,
  checkPermissionByRole,
  [
    // check existance
    body([
      "evolution.temperature",
      "evolution.systolicBloodPressure",
      "evolution.diastolicBloodPressure",
      "evolution.heartRate",
      "evolution.breathingFrequency",
      "patientId",
    ]).notEmpty(),
    // check data type
    body([
      "evolution.temperature",
      "evolution.systolicBloodPressure",
      "evolution.diastolicBloodPressure",
      "evolution.heartRate",
      "evolution.breathingFrequency",
      "patientId",
    ]).isNumeric(),
  ],
  validate,
  Evolution.create
);

router.put(
  ServicePaths.PATIENT,
  checkPermissionByRole,
  [
    check("dni", "The DNI is mandatory").not().isEmpty(),
    check("dni", "The DNI has to be a number").isNumeric(),
    check("dni", "The DNI must have a minimum of 6 digits").isLength({
      min: 6,
    }),
    check("birthDate", "The date is mandatory").not().isEmpty(),
    check("birthDate").isString(),
    check("lastName", "The last name is mandatory").not().isEmpty(),
    check("lastName").isString(),
    check("name", "The name is mandatory").not().isEmpty(),
    check("name").isString(),
    check("direction", "The adress is mandatory").not().isEmpty(),
    check("direction").isString(),
    check("phone", "The phone is mandatory").not().isEmpty(),
    check("phone").isString(),
    check("email", "The email is mandatory").not().isEmpty(),
    check("email", "The email is invalid").isEmail(),
    check("socialSecurity").not().isEmpty(),
    check("socialSecurity").isString(),
    check("background_clinical", "Obligatory field").not(),
    check(
      "contactPerson_lastName",
      "The last name of the contact person is required"
    )
      .not()
      .isEmpty(),
    check("contactPerson_lastName").isString(),
    check("contactPerson_name", "The name of the contact person is required")
      .not()
      .isEmpty(),
    check("contactPerson_name").isString(),
    check("contactPerson_relationship", "Obligatory field").not().isEmpty(),
    check("contactPerson_relationship").isString(),
    check("contactPerson_phone", "Obligatory field").not().isEmpty(),
    check("contactPerson_phone").isString(),
  ],
  createPatient
);

export default router;
