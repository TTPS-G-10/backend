import newStructureSystem from "../controllers/newStructureSystem";
import deleteStructureSystem from "./../controllers/deleteStructureSystem";
import editStructureSystem from "./../controllers/editStructureSystem";
import Router, { Response, NextFunction, Request } from "express";
import { CustomRequest } from "../model/Request";
import { Role } from "../model/User";
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

const { check } = require("express-validator");

router.post(
  ServicePaths.SYSTEM,
  [check("nombre", "El nombre es obligatorio").not().isEmpty()],
  checkPermissionByRole,

  newStructureSystem
);

router.delete(
  ServicePaths.SYSTEM,
  checkPermissionByRole,
  check("systemId", "El id del systema es obligatorio").not().isEmpty(),
  deleteStructureSystem
);
router.put(
  ServicePaths.SYSTEM,
  checkPermissionByRole,
  [
    check("nombre", "El valor es obligatorio").not().isEmpty(),
    check("clave", "El identificador es obligatorio").not().isEmpty(),
    check("systemId", "El id del systema es obligatorio").not().isEmpty(),
  ],
  editStructureSystem
);

export default router;
