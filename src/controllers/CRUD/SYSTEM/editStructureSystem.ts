import { validationResult } from "express-validator";
import queries from "../../../DAL/queries";
import { Request, Response } from "express";
const editStructure = async (req: Request, res: Response) => {
  const { clave, nombre, systemId } = req.body;
  console.log(clave, nombre, systemId);
  //corroborate errors
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    return res.sendStatus(400);
  }
  try {
    const sistemChanges = await queries.returnCantOfSistemsChangesOfAnySystemForId(
      systemId
    );
    const sc = sistemChanges ? sistemChanges.cant : 0;
    if (sc === 0 || clave === "infinitBeds") {
      await queries.update("`system`", "id", {
        set: clave + " = '" + nombre + "'",
        id: systemId,
      });
      res.sendStatus(204);
    }
  } catch (error) {
    return res.status(500);
  }
};
export default editStructure;
