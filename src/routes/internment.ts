import infoInternment from "../controllers/CRUD/INTERNMENT/infoInternment";
import infoInternments from "../controllers/CRUD/INTERNMENT/infoInternments";
import createInternment from "../controllers/CRUD/INTERNMENT/createInternment";
import createInternmentWithData from "../controllers/CRUD/INTERNMENT/createInternmentWithData";
import createInternmentWithNewBed from "../controllers/CRUD/INTERNMENT/createInternmentWithNewBed";
import finishInternment from "../controllers/CRUD/INTERNMENT/finishInternment";
import { check } from "express-validator";
import { CustomRequest } from "../model/Request";
import { Role } from "../model/User";
import { ServicePaths } from "../model/Paths";
import EgressRules from "../systemEgress.json";
import { Location } from "../model/Location";
import { Internment } from "../model/Internment";
import { User } from "../model/User";
import queries from "../DAL/queries";
import Router, { Response, NextFunction, Request } from "express";
import { type } from "os";

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

const checkEgress = async (req: Request, res: Response, next: NextFunction) => {
  const user: User = (req as CustomRequest).user;

  const internment:
    | Internment
    | null
    | undefined = await queries.findInternmentWithId(
    (req as CustomRequest).body.internmentId
  );
  if (!internment) {
    console.log("the internment was not found");
    return res.sendStatus(404);
  }

  const location:
    | Location
    | null
    | undefined = await queries.LocationOfPatientWithPatientId(
    internment.patientId
  );
  if (!location) {
    console.log("the patient was not found");
    return res.sendStatus(404);
  }

  if (!(location.systemId === user.systemId)) {
    console.log("the patient is in another system");
    return res.sendStatus(403);
  }

  console.log("typeeee", (req as CustomRequest).body.type);
  if ("EGRESS" === (req as CustomRequest).body.type) {
    const allowedSystems = (EgressRules as any)["EGRESS"];
    console.log("permitidos", allowedSystems);

    if (!allowedSystems.includes(location.systemName)) {
      console.log(
        "Perform Action EGREES =>from ",
        location.systemName,
        " to ",
        "EGREES"
      );
      return res.sendStatus(403);
    } else {
      next();
    }
  } else {
    next();
  }
};

router.get(
  ServicePaths.INTERNMENT + "/all",
  checkPermissionByRole,
  [check("patientId").not().isEmpty()],
  infoInternments
);

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

router.put(
  "/internment/finish",
  checkPermissionByRole,
  checkEgress,
  [(check("internmentId").not().isEmpty(), check("type").not().isEmpty())],
  finishInternment
);

export default router;
