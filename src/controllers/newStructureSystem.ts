import { validationResult } from "express-validator";
import queries from "../database/queries";
import { Request, Response } from "express";

const newStructure = async (req: Request, res: Response) => {
  const { nombre } = req.body;
  console.log(nombre);
  //corroborate errors
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400);
  }
  try {
    await queries
    .insert("INSERT INTO `system`", {
      name: nombre,
      infinitBeds: false,
    });
    console.log('inserto bien');
    res.sendStatus(201);
  } catch (error) {
    return res.status(500);
  }
};
export default newStructure;
