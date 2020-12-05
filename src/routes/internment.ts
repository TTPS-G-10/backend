import infoInternment from "../controllers/CRUD/INTERNMENT/infoInternment";
import createInternment from "../controllers/CRUD/INTERNMENT/createInternment";
import createInternmentWithData from "../controllers/CRUD/INTERNMENT/createInternmentWithData";
import createInternmentWithNewBed from "../controllers/CRUD/INTERNMENT/createInternmentWithNewBed";
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
  ServicePaths.INTERNMENT,
  checkPermissionByRole,
  [check("id").not().isEmpty()],
  infoInternment
);

router.post(
  ServicePaths.INTERNMENT,
  checkPermissionByRole,
  [check("id").not().isEmpty()],
  createInternment
);

router.put(
  ServicePaths.INTERNMENT,
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

router.put(
  "/internmentWithNewBed",
  checkPermissionByRole,
  [
    check("idPatient").not().isEmpty(),
    check("bed").not().isEmpty(),
    check("room").not().isEmpty(),
    check("historyOfDisease").not().isEmpty(),
    check("dateOfSymptoms").not().isEmpty(),
    check("dateOfDiagnosis").not().isEmpty(),
  ],
  createInternmentWithNewBed
);

export default router;
