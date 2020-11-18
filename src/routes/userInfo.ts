import userInfo from "../controllers/userInfo";
import { CustomRequest } from "../model/Request";
import { Role } from "../model/User";
import Router, { Response, NextFunction, Request } from "express";
const router = Router();

const checkPermissionByRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const allowedRoles = [Role.Doctor, Role.Doctor];
  if (allowedRoles.includes((req as CustomRequest).user.role)) {
    next();
  } else {
    res.sendStatus(403); // Forbidden
  }
};

router.get("/userInfo", checkPermissionByRole, userInfo);

export default router;
