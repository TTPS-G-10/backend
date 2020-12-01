import createSystemChange from "../controllers/CRUD/SYSTEMCHANGES/create";
import Router, { Response, NextFunction, Request } from "express";
import { CustomRequest } from "../model/Request";
import { Role } from "../model/User";
import { ServicePaths } from "../model/Paths";
const { check } = require("express-validator");

const router = Router();

const checkPermissionByRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allowedRoles = [Role.SystemChief, Role.Doctor];
  if (allowedRoles.includes((req as CustomRequest).user.role)) {
    next();
  } else {
    res.sendStatus(403); // Forbidden
  }
};

router.post(
  ServicePaths.SYSTEMCHANGE,
  [
    check("patientId", "El id de paciente es obligatorio").not().isEmpty(),
    check("system", "El id de sistema es obligatorio").not().isEmpty(),
    check("room", "El id de sala es obligatorio").not().isEmpty(),
  ],
  checkPermissionByRole,
  createSystemChange
);

export default router;
