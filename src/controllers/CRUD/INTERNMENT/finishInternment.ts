import { validationResult } from "express-validator";
import queries from "../../../DAL/queries";
import { Request, Response } from "express";
import { User } from "../../../model/User";
import { Location } from "../../../model/Location";
import { Bed } from "../../../model/Bed";
import { Internment } from "../../../model/Internment";
import { CustomRequest } from "../../../model/Request";

function finishHospitalization(
  bedId: number,
  internmentId: number,
  patientId: number,
  res: Response<any>
) {
  queries.unassingPatientToBed(bedId).then(() => {
    queries
      .deleteAssignedDoctors(internmentId)
      .then(() => {
        return res.sendStatus(201);
      })
      .catch(async () => {
        console.log("could not delete the doctors assigned to the patient");
        queries.assignPatientToBed(patientId, bedId);
      });
  });
}

const finishInternment = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  const { internmentId, type } = req.body;
  console.log(
    "llego a crear systemChange",
    "internmentId",
    internmentId,
    "type",
    type
  );
  if (user) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("parametro no valido");
      return res.sendStatus(400);
    }
    const internment:
      | Internment
      | null
      | undefined = await queries.findInternmentWithId(internmentId);
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
    if (type == "OBITO") {
      queries
        .setObitoOfInternment(new Date(Date.now()), internment.id)
        .then(() => {
          finishHospitalization(
            location.bedId,
            internment.id,
            internment.patientId,
            res
          );
        })
        .catch(() => {
          console.log("could not finish the internment");
          return res.sendStatus(500);
        });
    } else {
      if (type == "EGRESS") {
        queries
          .setEgressOfInternment(new Date(Date.now()), internment.id)
          .then(() => {
            finishHospitalization(
              location.bedId,
              internment.id,
              internment.patientId,
              res
            );
          })
          .catch(() => {
            console.log("could not finish the internment");
            return res.sendStatus(500);
          });
      } else {
        console.log("the type of finalization is not valid");
        return res.sendStatus(500);
      }
    }
  } else {
    res.sendStatus(403);
  }
};
export default finishInternment;
