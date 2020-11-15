import { validationResult } from "express-validator";
import queries from "../database/queries";
import { Request, Response } from "express";

const newStructure = async (req: Request, res: Response) => {
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
      .insert("INSERT INTO `bed`", {
        name: nombre,
        roomId: roomId,
      })
      .then((ok) => console.log("insertó cama?", ok));

    res.json({ redirect: "/adminsys" });
  } catch (error) {
    return res.status(400);
  }
};
export default newStructure;
