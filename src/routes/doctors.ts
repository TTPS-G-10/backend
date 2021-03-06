import doctorsOfSystem from "../controllers/CRUD/DOCTORS/doctorsToAssing";
import assingDoctorsToPatient from "../controllers/CRUD/DOCTORS/assignDoctorsToPatient";
import doctorsOfSystemToSystemchief from "../controllers/CRUD/DOCTORS/doctorsToSelectSistemChief";
import Router, { Response, NextFunction, Request } from "express";
import { CustomRequest } from "../model/Request";
import { Role } from "../model/User";
import { check } from "express-validator";
import { ServicePaths } from "../model/Paths";
const router = Router();

const checkPermissionByRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allowedRoles = [Role.SystemChief];
  if (allowedRoles.includes((req as CustomRequest).user.role)) {
    next();
  } else {
    res.sendStatus(403); // Forbidden
  }
};

const checkPermissionByRoleByEditSysteChief = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allowedRoles = [Role.Admin];
  if (allowedRoles.includes((req as CustomRequest).user.role)) {
    next();
  } else {
    res.sendStatus(403); // Forbidden
  }
};

router.get(
  ServicePaths.DOCTORS,
  [check("id").not().isEmpty()],
  checkPermissionByRole,
  doctorsOfSystem
);

router.get(
  ServicePaths.DOCTORS + "/ofsystem",
  [check("systemId").not().isEmpty()],
  checkPermissionByRoleByEditSysteChief,
  doctorsOfSystemToSystemchief
);

router.post(
  ServicePaths.DOCTORS,
  [check("patientId").not().isEmpty()],
  [check("doctors").not().isEmpty()],
  checkPermissionByRole,
  assingDoctorsToPatient
);

export default router;
