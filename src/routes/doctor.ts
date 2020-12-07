import changeSystemchief from "../controllers/CRUD/DOCTOR/changeSystemChief";
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
  const allowedRoles = [Role.Admin];
  if (allowedRoles.includes((req as CustomRequest).user.role)) {
    next();
  } else {
    res.sendStatus(403); // Forbidden
  }
};

router.put(
  ServicePaths.DOCTOR + "/systemChief",
  [check("systemId").not().isEmpty()],
  [check("doctorId").not().isEmpty()],
  checkPermissionByRole,
  changeSystemchief
);

export default router;
