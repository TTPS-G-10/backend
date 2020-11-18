import searchPattient from "../controllers/searchPatient";
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
  "/searchPatient",
  checkPermissionByRole,
  [
    check("dni", "El DNI es obligatorio").not().isEmpty(),
    check("dni", "El DNI tiene que ser un numero").isNumeric(),
    check("dni", "El DNI tiene que tener minimo 6 digitos").isLength({
      min: 6,
    }),
  ],
  searchPattient
);

export default router;
