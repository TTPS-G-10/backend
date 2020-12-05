import createSystemChange from "../controllers/CRUD/SYSTEMCHANGES/create";
import Router, { Response, NextFunction, Request } from "express";
import { CustomRequest } from "../model/Request";
import { Role } from "../model/User";
import { ServicePaths } from "../model/Paths";
import { Location } from "../model/Location";
import { User } from "../model/User";
import queries from "../DAL/queries";
import SystemChangesRules from "../systemPass.json";
const { check } = require("express-validator");

const router = Router();

const checkPermissionByRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user: User = (req as CustomRequest).user;

  const location:
    | Location
    | null
    | undefined = await queries.LocationOfPatientWithPatientId(
    (req as CustomRequest).body.patientId
  );
  if (!location) {
    console.log("the patient was not found");
    return res.sendStatus(404);
  }

  if (!(location.systemId === user.systemId)) {
    console.log("the patient is in another system");
    return res.sendStatus(403);
  }

  const allowedSystems = (SystemChangesRules as any)[location.systemName];

  if (!allowedSystems.includes((req as CustomRequest).body.systemName)) {
    console.log("the patient dont not pass to system");
    return res.sendStatus(403);
  }

  const allowedRoles = [Role.SystemChief, Role.Doctor];
  if (allowedRoles.includes(user.role)) {
    next();
  } else {
    res.sendStatus(403); // Forbidden
  }
};

router.post(
  ServicePaths.SYSTEMCHANGE,
  [
    check("patientId", "El id de paciente es obligatorio").not().isEmpty(),
    check("systemName", "El nombre de sistema es obligatorio").not().isEmpty(),
    check("room", "El id de sala es obligatorio").not().isEmpty(),
  ],
  checkPermissionByRole,
  createSystemChange
);

export default router;
