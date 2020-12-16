import state from "../controllers/userState";

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
  const allowedRoles = [Role.Doctor, Role.SystemChief];
  if (allowedRoles.includes((req as CustomRequest).user.role)) {
    next();
  } else {
    res.sendStatus(403); // Forbidden
  }
};

router.put(
  "/user",
  [check("value").not().isEmpty()],
  checkPermissionByRole,
  state.updateStateUser
);

router.get("/user", checkPermissionByRole, state.returnStateUser);

export default router;
