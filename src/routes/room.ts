import newStructureRoom from "../controllers/newStructureRoom";
import deleteStructureRoom from "../controllers/deleteStructureRoom";
import editStructureRoom from "./../controllers/editStructureRoom";
import Router, { Response, NextFunction, Request } from "express";
import { CustomRequest } from "../model/Request";
import { Role } from "../model/User";
const { check } = require("express-validator");
const router = Router();
const path = "/room";

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

router.post(
  path,
  checkPermissionByRole,
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("systemId", "systemId es obligatorio").not().isEmpty(),
  ],
  newStructureRoom
);

router.delete(
  path,
  checkPermissionByRole,
  check("roomId", "El id de la sala es obligatorio").not().isEmpty(),
  deleteStructureRoom
);

router.put(
  path,
  checkPermissionByRole,
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("roomId", "El id de la sala es obligatorio").not().isEmpty(),
  ],
  editStructureRoom
);
export default router;
