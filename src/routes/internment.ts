import infoInternment from "../controllers/infoInternment";
import createInternment from "../controllers/createInternment";
import createInternmentWithData from "../controllers/createInternmentWithData";
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

router.post(
  "/internment",
  checkPermissionByRole,
  [check("id").not().isEmpty()],
  createInternment
);

router.put(
  "/internment",
  checkPermissionByRole,
  [
    check("idPatient").not().isEmpty(),
    check("bed").not().isEmpty(),
    check("room").not().isEmpty(),
    check("historyOfDisease").not().isEmpty(),
    check("dateOfSymptoms").not().isEmpty(),
    check("dateOfDiagnosis").not().isEmpty(),
  ],
  createInternmentWithData
);

export default router;
