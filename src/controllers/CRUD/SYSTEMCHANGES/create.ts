import { validationResult } from "express-validator";
import queries from "../../../DAL/queries";
import { Request, Response } from "express";
import { User } from "../../../model/User";
import { Location } from "../../../model/Location";
import { Bed } from "../../../model/Bed";
import { Internment } from "../../../model/Internment";
import { CustomRequest } from "../../../model/Request";

const createSystemChange = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  const { patientId, system, room } = req.body;
  console.log(
    "llego a crear systemChange",
    "patientId",
    patientId,
    "system",
    system,
    "room",
    room
  );
  if (user) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("parametro no valido");
      return res.sendStatus(400);
    }
    const location:
      | Location
      | null
      | undefined = await queries.LocationOfPatientWithPatientId(patientId);
    if (!location) {
      console.log("the patient was not found");
      return res.sendStatus(404);
    }

    if (!(location.systemId === user.systemId)) {
      console.log("the patient is in another system");
      return res.sendStatus(403);
    }

    const internment:
      | Internment
      | null
      | undefined = await queries.findOpenInternmentWithPatientId(patientId);
    if (!internment) {
      console.log("the internment was not found");
      return res.sendStatus(404);
    }

    const bed: Bed | null | undefined = await queries.findBedsWithSystemAndRoom(
      system,
      room
    );
    if (!bed) {
      console.log(
        "there are no free beds in the room",
        room,
        " belonging to the system",
        system
      );
      return res.sendStatus(404);
    }

    queries
      .assignPatientToBed(patientId, bed.id)
      .then(() => {
        queries
          .createSystemChange(internment.id, system)
          .then((okey) => {
            queries.unassingPatientToBed(location.bedId);
            console.log("se creo el system changes:", okey);
            return res.json({
              redirect: "/internment/" + patientId,
            });
          })
          .catch(async () => {
            console.log("Could not create system changes");
            queries.unassingPatientToBed(bed.id);
            return res.sendStatus(500);
          });
      })
      .catch(async () => {
        console.log("Could not assing patient at bed");
        return res.sendStatus(500);
      });
  } else {
    res.sendStatus(403);
  }
};
export default createSystemChange;
