import { validationResult } from "express-validator";
import queries from "../../../DAL/queries";
import { Request, Response } from "express";

const newStructure = async (req: Request, res: Response) => {
  const { nombre, roomId } = req.body;
  console.log(nombre, roomId);
  //corroborate errors
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.sendStatus(400);
  }
  try {
    await queries.insert("INSERT INTO `bed`", {
      name: nombre,
      roomId: roomId,
    });
    res.sendStatus(201);
  } catch (error) {
    return res.status(500);
  }
};
export default newStructure;
