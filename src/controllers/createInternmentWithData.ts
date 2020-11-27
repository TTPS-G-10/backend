import { validationResult } from "express-validator";
import queries from "../database/queries";
import { Request, Response } from "express";
import { User } from "../model/User";
import { CustomRequest } from "../model/Request";

function createInternment(
  historyOfDisease: any,
  dateOfSymptoms: any,
  dateOfDiagnosis: any,
  idPatientN: number,
  systemId: number,
  bedN: number,
  res: Response<any>
) {
  queries
    .createInternment(
      historyOfDisease,
      new Date(dateOfSymptoms),
      new Date(dateOfDiagnosis),
      idPatientN
    )
    .then((okey) => {
      const internmentId = okey.insertId;
      createSystemChangesToPatient(
        internmentId,
        systemId,
        bedN,
        idPatientN,
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
  res: Response<any>
) {
  queries
    .createSystemChange(internmentId, systemId)
    .then((o) => {
      console.log("se creo el system changes:", o);
      return res.json({
        redirect: "/internment/" + idPatient,
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

const createInternmentWhitData = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  console.log("llego a crear internament whith data", req.body);
  const {
    dateOfSymptoms,
    dateOfDiagnosis,
    historyOfDisease,
    idPatient,
    room,
    bed,
  } = req.body;

  if (user && user.systemId === 1) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("invalid parameter");
      return res.sendStatus(400);
    }

    const roomN: number = parseInt(room, 10);
    const bedN: number = parseInt(bed, 10);
    const idPatientN: number = parseInt(idPatient, 10);
    const systemId = 1;

    const resul = await queries.patientHasCurrentHospitalization(idPatientN);

    if (resul.length != 0) {
      console.log("The patient has a current hospitalzation");
      return res.sendStatus(500);
    }

    queries
      .stillFreeBed(systemId, bedN, roomN)
      .then((freeBed) => {
        if (freeBed[0].patientId === null) {
          queries.assignPatientToBed(idPatientN, bedN, roomN).then(() => {
            createInternment(
              historyOfDisease,
              dateOfSymptoms,
              dateOfDiagnosis,
              idPatientN,
              systemId,
              bedN,
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
export default createInternmentWhitData;
