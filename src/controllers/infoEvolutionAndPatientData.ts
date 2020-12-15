import { Request, Response } from "express";
import { User } from "../model/User";
import queries from "../DAL/queries";
import { CustomRequest } from "../model/Request";

const infoEvolutionAndPatientData = async (req: Request, res: Response) => {
  const user: User = (req as CustomRequest).user;
  if (user) {
    try {
      const idPatient = req.query.id as string;
      const id = parseInt(idPatient, 10);
      const patientSystem = await queries.LocationOfPatientWithPatientId(id);
      if (patientSystem?.systemId != user.systemId) {
        console.log("el paciente no pertenece a su sistema");
        res.sendStatus(403);
      }
      const patient = await queries.findPatientByID(id);
      const lastEvolve = await queries.lastEvolveByPatientID(id);
      console.log("patient", patient);
      console.log("evolve", lastEvolve);
      res.json({
        name: patient?.name,
        lastName: patient?.lastName,
        lastEvolve: lastEvolve,
      });
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  } else {
    res.sendStatus(404);
  }
};
export default infoEvolutionAndPatientData;
