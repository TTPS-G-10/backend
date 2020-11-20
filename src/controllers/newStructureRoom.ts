import { validationResult } from "express-validator";
import queries from "../database/queries";
import { Request, Response } from "express";

const newStructure = async (req: Request, res: Response) => {
  const { nombre, systemId } = req.body;
  console.log(nombre, systemId);
  //corroborate errors
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.sendStatus(400);
  }
  try {
    await queries.insert("INSERT INTO `room`", {
      name: nombre,
      systemId: systemId,
    });
    res.sendStatus(201);
  } catch (error) {
    return res.status(500);
  }
};
export default newStructure;
