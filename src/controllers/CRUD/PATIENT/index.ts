import { Request, Response } from "express";
import queries from "../../../DAL/queries";
import { Patient } from "../../../model/Patient";

const getPatientById = async (req: Request, res: Response) => {
  try {
    const patient: Patient | null = await queries.getPatientById(req.params.id);
    res.json({ patient });
  } catch (err) {
    console.error(err);
    res.status(500);
  }
};
const Patient = {
  getPatientById,
};
export default Patient;
