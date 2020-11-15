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
    return res.status(400).send("Email o Contraseña incorrecta");
  }
  try {
    queries
      .update("`bed`", "id", {
        set: "name = '" + nombre + "'",
        id: bedId,
      })
      .then((ok) => console.log("modificó bien?", ok));

    res.json({ redirect: "/adminsys" });
  } catch (error) {
    return res.status(400);
  }
};
export default editStructure;
