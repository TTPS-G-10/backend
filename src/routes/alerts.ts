import { Router, Request, Response, NextFunction } from "express";
import { Role } from "../model/User";
import { CustomRequest } from "../model/Request";
import { ServicePaths } from "../model/Paths";
import getAlerts from "../controllers/alerts";

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
    next();
    // res.sendStatus(403); // Forbidden
  }
};

router.get(ServicePaths.ALERTS, checkPermissionByRole, getAlerts);

export default getAlerts;
