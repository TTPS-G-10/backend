import { validationResult } from "express-validator";
import queries from "../../../DAL/queries";
import { Request, Response } from "express";
import { Role, User } from "../../../model/User";
import { Location } from "../../../model/Location";
import { Bed } from "../../../model/Bed";
import { Internment } from "../../../model/Internment";
import { CustomRequest } from "../../../model/Request";
import { System } from "../../../model/System";
import systems from "../../systems";

const assingDoctorsToPatient = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  const { patientId, doctors } = req.body;
  console.log(
    "llego a crear assingnedDoctor",
    req.body,
    "------patientId",
    patientId,
    "doctors",
    doctors
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
    queries.deleteAssignedDoctors(internment.id);
    doctors.map(async (doctor: number) => {
      const doc: User | null | undefined = await queries.findUserById(doctor);
      if (!doc) {
        console.log("the doctor was not found");
        return res.sendStatus(404);
      }
      if (!(doc.role === Role.Doctor)) {
        console.log("the doctor was not found");
        return res.sendStatus(404);
      }

      const system:
        | System
        | null
        | undefined = await queries.findSystemOfUserForId(doctor);
      if (!system) {
        console.log("the doctor was not found");
        return res.sendStatus(404);
      }

      await queries.createAssignedDoctor(internment.id, doctor);
    });

    return res.sendStatus(200);
  } else {
    res.sendStatus(403);
  }
};
export default assingDoctorsToPatient;
