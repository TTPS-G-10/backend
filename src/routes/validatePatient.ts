import validatePatient from "../controllers/validatePatient";
import { check } from "express-validator";
import { CustomRequest } from "../model/Request";
import { Role } from "../model/User";
import Router, { Response, NextFunction, Request } from "express";
const router = Router();

const checkPermissionByRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allowedRoles = [Role.Doctor, Role.Doctor];
  if (allowedRoles.includes((req as CustomRequest).user.role)) {
    next();
  } else {
    res.sendStatus(403); // Forbidden
  }
};

router.post(
  "/validatePatient",
  checkPermissionByRole,
  [
    check("dni", "El DNI es obligatorio").not().isEmpty(),
    check("dni", "El DNI tiene que ser un numero").isNumeric(),
    check("dni", "El DNI tiene que tener minimo 6 digitos").isLength({
      min: 6,
    }),
    check("birthDate", "La fecha es obligatoria").not().isEmpty(),
    check("birthDate").isString(),
    check("lastName", "El apellido es obligatorio").not().isEmpty(),
    check("lastName").isString(),
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("name").isString(),
    check("direction", "La direccion es obligatoria").not().isEmpty(),
    check("direction").isString(),
    check("phone", "El telefono es obligatorio").not().isEmpty(),
    check("phone").isString(),
    check("email", "El email es obligatorio").not().isEmpty(),
    check("email", "El email es invalido").isEmail(),
    check("socialSecurity").not().isEmpty(),
    check("socialSecurity").isString(),
    check("background_clinical", "campo obligatorio").not(),
    check(
      "contactPerson_lastName",
      "El apellido de la persona de contacto es obligatorio"
    )
      .not()
      .isEmpty(),
    check("contactPerson_lastName").isString(),
    check(
      "contactPerson_name",
      "El nombre de la persona de contacto es obligatorio"
    )
      .not()
      .isEmpty(),
    check("contactPerson_name").isString(),
    check(
      "contactPerson_relationship",
      "El nombre de la persona de contacto es obligatorio"
    )
      .not()
      .isEmpty(),
    check("contactPerson_relationship").isString(),
    check("contactPerson_phone", "El telefono es obligatorio").not().isEmpty(),
    check("contactPerson_phone").isString(),
  ],
  validatePatient
);

export default router;
