import systems from "./../controllers/systems";
import systemsWithSpaceForPatients from "./../controllers/systemsWithSpaceForPatients";
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
const checkPermissionByRoleForSistemChanges = (
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

router.get(ServicePaths.SYSTEMS, checkPermissionByRole, systems);

router.get(
  "/systems/withSpace",
  [check("id").not().isEmpty()],
  checkPermissionByRoleForSistemChanges,
  systemsWithSpaceForPatients
);

export default router;
