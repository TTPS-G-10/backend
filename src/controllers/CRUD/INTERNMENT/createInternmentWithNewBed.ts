import { validationResult } from "express-validator";
import queries from "../../../DAL/queries";
import { Request, Response } from "express";
import { User } from "../../../model/User";
import { ServiceSystemNames } from "../../../model/SystemNames";
import { CustomRequest } from "../../../model/Request";

function createInternment(
  historyOfDisease: any,
  dateOfSymptoms: any,
  dateOfDiagnosis: any,
  idPatientN: number,
  systemId: number,
  systemChiefId: number,
  bedN: number,
  res: Response<any>
) {
  const dateOfHospitalization = Date.now();
  queries
    .createInternment(
      historyOfDisease,
      new Date(dateOfSymptoms),
      new Date(dateOfDiagnosis),
      new Date(dateOfHospitalization),
      idPatientN
    )
    .then((okey) => {
      const internmentId = okey.insertId;
      createSystemChangesToPatient(
        internmentId,
        systemId,
        bedN,
        idPatientN,
        systemChiefId,
        res
      );
    })
    .catch(() => {
      console.log("Hospitalization could not be created");
      queries.unassingPatientToBed(bedN).then(() => {
        queries.removeBed(bedN);
      });
      return res.sendStatus(500);
    });
}

function createSystemChangesToPatient(
  internmentId: any,
  systemId: number,
  bedN: number,
  idPatient: number,
  systemChiefId: number,
  res: Response<any>
) {
  queries
    .createSystemChange(internmentId, systemId)
    .then((o) => {
      queries.createAssignedDoctor(internmentId, systemChiefId);

      return res.json({
        redirect: "/internment/" + internmentId,
      });
    })
    .catch(async () => {
      console.log("Could not create system changes");
      //delete internment data
      await queries
        .unassingPatientToInternment(internmentId)
        .then(await queries.deleteInternment(internmentId));
      queries.unassingPatientToBed(bedN);
      return res.sendStatus(500);
    });
}

const createInternmentWithNewBed = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  console.log(
    "-----------createInternmentWithNewBed----------------",
    req.body
  );
  const {
    dateOfSymptoms,
    dateOfDiagnosis,
    historyOfDisease,
    idPatient,
    room,
  } = req.body;
  const system = await queries.findSystemForName(ServiceSystemNames.GUARDIA);
  if (!system || system.infinitBeds == false) {
    console.log("the system was not found");
    return res.sendStatus(404);
  }
  if (user && user.systemName === ServiceSystemNames.GUARDIA) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("invalid parameter");
      return res.sendStatus(400);
    }

    const roomN: number = parseInt(room, 10);
    const idPatientN: number = parseInt(idPatient, 10);
    const systemId = system.id;
    const bedName: string = req.body.bed as string;
    console.log("bedName:", bedName);
    const resul = await queries.patientHasCurrentHospitalization(idPatientN);

    if (resul.length != 0) {
      console.log("The patient has a current hospitalzation");
      return res.sendStatus(500);
    }
    console.log("sistem id:::::::::", systemId);
    const systemChief:
      | User
      | null
      | undefined = await queries.findSystemChiefBySystemId(systemId);

    if (!systemChief) {
      console.log("the systemChief was not found");
      return res.sendStatus(404);
    }
    const systemChiefId = systemChief.id;
    console.log("system chief askjdhasdlfhasdlfjhFKLAF:", systemChief);

    queries
      .insertBedWithPatient(bedName, roomN, idPatientN)
      .then((newBed) => {
        console.log("newBed:", newBed);
        if (newBed.insertId) {
          const bedN = newBed.insertId;
          createInternment(
            historyOfDisease,
            dateOfSymptoms,
            dateOfDiagnosis,
            idPatientN,
            systemId,
            bedN,
            systemChiefId,
            res
          );
        }
      })
      .catch(() => {
        console.log("the internment could not be created");
        return res.sendStatus(500);
      });
  } else {
    return res.sendStatus(403);
  }
};
export default createInternmentWithNewBed;
