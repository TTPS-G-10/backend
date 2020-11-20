import { validationResult } from "express-validator";
import queries from "../database/queries";
import { Request, Response } from "express";

const editStructure = async (req: Request, res: Response) => {
  const { nombre, bedId } = req.body;
  console.log(nombre, bedId);
  //corroborate errors
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400);
  }
  try {
    await queries
    .update("`bed`", "id", {
      set: "name = '" + nombre + "'",
      id: bedId,
    });
    res.sendStatus(204);
  } catch (error) {
    return res.status(400);
  }
};
export default editStructure;