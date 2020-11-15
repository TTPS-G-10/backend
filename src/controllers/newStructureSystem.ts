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
    return res.status(400).send("Email o Contraseña incorrecta");
  }
  try {
    queries
      .insert("INSERT INTO `system`", {
        name: nombre,
        infinitBeds: false,
      })
      .then((ok) => console.log("insertó system?", ok));

    res.json({ redirect: "/adminsys" });
  } catch (error) {
    return res.status(400);
  }
};
export default newStructure;
