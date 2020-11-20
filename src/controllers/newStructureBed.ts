import { validationResult } from "express-validator";
import queries from "../database/queries";
import { Request, Response } from "express";
import { FrontendPaths } from "../model/Paths";

const newStructure = async (req: Request, res: Response) => {
  const { nombre, roomId } = req.body;
  console.log(nombre, roomId);
  //corroborate errors
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400);
  }
  try {
    await queries
    .insert("INSERT INTO `bed`", {
      name: nombre,
      roomId: roomId,
    });
    res.sendStatus(201);
  } catch (error) {
    return res.status(500);
  }
};
export default newStructure;
