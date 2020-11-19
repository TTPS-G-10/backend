import { validationResult } from "express-validator";
import queries from "../database/queries";
import { Request, Response } from "express";
import dbAPI from "../database/database";
import { Path } from "../model/Paths";
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
    const trx = await dbAPI.start();
    const sistemChanges = await queries.returnCantOfSistemsChangesOfAnySystemForId(
      systemId,
      trx
    );
    dbAPI.commit(trx);
    const sc = sistemChanges ? sistemChanges.cant : 0;
    if (sc === 0 || clave === "infinitBeds") {
      queries
        .update("`system`", "id", {
          set: clave + " = '" + nombre + "'",
          id: systemId,
        })
        .then((ok) => console.log("modificó bien?", ok));

      res.json({ redirect: Path.ADMINSYS });
    }
  } catch (error) {
    return res.sendStatus(400);
  }
};
export default editStructure;
