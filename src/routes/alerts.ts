import { Router, Request, Response, NextFunction } from "express";
import { Role } from "../model/User";
import { CustomRequest } from "../model/Request";
import { ServicePaths } from "../model/Paths";
import Alerts from "../controllers/alerts";

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

router.get(ServicePaths.ALERTS, checkPermissionByRole, Alerts.getAlerts);
router.put(
  ServicePaths.ALERT_SEEN,
  checkPermissionByRole,
  Alerts.setAlertAsSeen
);

export default router;
