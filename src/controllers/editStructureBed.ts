import { validationResult } from "express-validator";
import queries from "../database/queries";
import { Request, Response } from "express";
import { Path } from "../model/Paths";

const editStructure = async (req: Request, res: Response) => {
  const { nombre, bedId } = req.body;
  console.log(nombre, bedId);
  //corroborate errors
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.sendStatus(400);
  }
  try {
    queries
      .update("`bed`", "id", {
        set: "name = '" + nombre + "'",
        id: bedId,
      })
      .then((ok) => console.log("modificó bien?", ok));

    res.json({ redirect: Path.ADMINSYS });
  } catch (error) {
    return res.sendStatus(400);
  }
};
export default editStructure;
