import { validationResult } from "express-validator";
import queries from "../database/queries";
import { Request, Response } from "express";
import { Path } from "../model/Paths";

const editStructure = async (req: Request, res: Response) => {
  const { nombre, roomId } = req.body;
  console.log(nombre, roomId);
  //corroborate errors
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400);
  }
  try {
    queries
      .update("`room`", "id", {
        set: "name = '" + nombre + "'",
        id: roomId,
      })
      .then((ok) => console.log("modificó bien?", ok));

    res.json({ redirect: Path.ADMINSYS });
  } catch (error) {
    return res.status(400);
  }
};
export default editStructure;
