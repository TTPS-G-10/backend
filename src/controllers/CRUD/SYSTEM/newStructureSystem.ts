import { validationResult } from "express-validator";
import queries from "../../../DAL/queries";
import { Request, Response } from "express";

const newStructure = async (req: Request, res: Response) => {
  const { nombre } = req.body;
  console.log(nombre);
  //corroborate errors
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.sendStatus(400);
  }
  try {
    await queries.insert("INSERT INTO `system`", {
      name: nombre,
      infinitBeds: false,
      totalBeds: 0,
      ocupedBeds: 0,
    });
    console.log("inserto bien");
    res.sendStatus(201);
  } catch (error) {
    return res.status(500);
  }
};
export default newStructure;
