import patients from "../controllers/patients";
import Router, { Response, NextFunction, Request } from "express";
import { CustomRequest } from "../model/Request";
import { Role } from "../model/User";
import { ServicePaths } from "../model/Paths";
import patientsOfUser from "../controllers/patientsAssignedToUser";
const router = Router();

const checkPermissionByRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allowedRoles = [Role.Doctor];
  if (allowedRoles.includes((req as CustomRequest).user.role)) {
    next();
  } else {
    res.sendStatus(403); // Forbidden
  }
};

const checkPermissionByRoleForPatientsOfUser = (
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

router.get(ServicePaths.PATIENTS, checkPermissionByRole, patients);

router.get(
  ServicePaths.PATIENTS + "/ofUser",
  checkPermissionByRoleForPatientsOfUser,
  patientsOfUser
);
export default router;
