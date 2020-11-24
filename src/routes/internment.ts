import infoInternment from "../controllers/infoInternment";
import { check } from "express-validator";
import { CustomRequest } from "../model/Request";
import { Role } from "../model/User";
import { ServicePaths } from "../model/Paths";
import Router, { Response, NextFunction, Request } from "express";

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

router.get(
  "/internment",
  checkPermissionByRole,
  [check("id").not().isEmpty()],
  infoInternment
);

export default router;
