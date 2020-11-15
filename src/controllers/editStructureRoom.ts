import { validationResult } from "express-validator";
import queries from "../database/queries";
import { Request, Response } from "express";

const editStructure = async (req: Request, res: Response) => {
  const { nombre, roomId } = req.body;
  console.log(nombre, roomId);
  //corroborate errors
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400).send("Email o Contraseña incorrecta");
  }
  try {
    queries
      .update("`room`", "id", {
        set: "name = '" + nombre + "'",
        id: roomId,
      })
      .then((ok) => console.log("modificó bien?", ok));

    res.json({ redirect: "/adminsys" });
  } catch (error) {
    return res.status(400);
  }
};
export default editStructure;
