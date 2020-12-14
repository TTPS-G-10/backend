import { validationResult } from "express-validator";
import queries from "../../../DAL/queries";
import { Request, Response } from "express";
import { User } from "../../../model/User";
import { ServiceSystemNames } from "../../../model/SystemNames";
import { CustomRequest } from "../../../model/Request";
import systems from "../../systems";

function createInternment(
  historyOfDisease: any,
  dateOfSymptoms: any,
  dateOfDiagnosis: any,
  idPatientN: number,
  systemId: number,
  bedN: number,
  systemChiefId: number,
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
      queries.unassingPatientToBed(bedN);
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

const createInternmentWithData = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  console.log("llego a crear internament Withh data", req.body);
  const {
    dateOfSymptoms,
    dateOfDiagnosis,
    historyOfDisease,
    idPatient,
    room,
    bed,
  } = req.body;

  const system = await queries.findSystemForName(ServiceSystemNames.GUARDIA);
  if (!system) {
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
    const bedN: number = parseInt(bed, 10);
    const idPatientN: number = parseInt(idPatient, 10);
    const systemId = system.id;

    const obito = await queries.findObitoInternmentWithPatientId(idPatientN);

    if (obito) {
      console.log("The patient has death");
      return res.sendStatus(500);
    }
    const resul = await queries.findOpenInternmentWithPatientId(idPatientN);

    if (resul) {
      console.log("The patient has a current hospitalzation");
      return res.sendStatus(500);
    }

    const systemChief:
      | User
      | null
      | undefined = await queries.findSystemChiefBySystemId(systemId);

    if (!systemChief) {
      console.log("the systemChief was not found");
      return res.sendStatus(404);
    }
    const systemChiefId = systemChief.id;
    queries
      .stillFreeBed(systemId, bedN, roomN)
      .then((freeBed) => {
        if (freeBed[0].patientId === null) {
          queries.assignPatientToBed(idPatientN, bedN).then(() => {
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
          });
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
export default createInternmentWithData;
