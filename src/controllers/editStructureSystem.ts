import { validationResult } from "express-validator";
import queries from "../database/queries";
import { Request, Response } from "express";

const editStructure = async (req: Request, res: Response) => {
  const { key, value, systemId } = req.body;
  console.log(key, value, systemId);
  //corroborate errors
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.status(400).send("Email o Contraseña incorrecta");
  }
  try {
    queries
      .update("`system`", "id", {
        set: key + " = '" + value + "'",
        id: systemId,
      })
      .then((ok) => console.log("modificó bien?", ok));

    res.json({ redirect: "/adminsys" });
  } catch (error) {
    return res.status(400);
  }
};
export default editStructure;
