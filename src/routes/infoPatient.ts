import infoPatient from "../controllers/infoPatient";
import { check } from "express-validator";
import Router, { Response, NextFunction, Request } from "express";
import { CustomRequest } from "../model/Request";
import { Role } from "../model/User";
const router = Router();
const path = "/infoPatient";

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

router.get(
  path,
  checkPermissionByRole,
  [check("id").not().isEmpty()],
  infoPatient
);

export default router;
