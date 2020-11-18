import newStructureBed from "./../controllers/newStructureBed";
import deleteStructureBed from "./../controllers/deleteStructureBed";
import editStructureBed from "./../controllers/editStructureBed";
import Router, { Response, NextFunction, Request } from "express";
import { CustomRequest } from "../model/Request";
import { Role } from "../model/User";
const { check } = require("express-validator");
const router = Router();
const path = "/bed";

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
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("roomId", "El id de la cama es obligatorio").not().isEmpty(),
  ],
  checkPermissionByRole,
  newStructureBed
);

router.delete(
  path,
  checkPermissionByRole,
  [check("bedId", "El id de la cama es obligatorio").not().isEmpty()],
  deleteStructureBed
);

router.put(
  path,
  checkPermissionByRole,
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("bedId", "El id de la cama es obligatorio").not().isEmpty(),
  ],
  editStructureBed
);
export default router;
