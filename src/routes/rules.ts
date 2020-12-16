import Router, { Response, NextFunction, Request } from "express";
import { CustomRequest } from "../model/Request";
import { Role } from "../model/User";
import rules from "../controllers/rules";
import { ServicePaths } from "../model/Paths";
import { check } from "express-validator";
import updateStateRule from "./../controllers/updateStateRule";
const router = Router();

const checkPermissionByRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allowedRoles = [Role.SystemRule];
  if (allowedRoles.includes((req as CustomRequest).user.role)) {
    next();
  } else {
    res.sendStatus(403); // Forbidden
  }
};

router.get(ServicePaths.RULES, checkPermissionByRole, rules);
router.post(
  ServicePaths.RULES,
  checkPermissionByRole,
  [check("ruleId").not().isEmpty(), check("value").not().isEmpty()],
  updateStateRule
);

export default router;
