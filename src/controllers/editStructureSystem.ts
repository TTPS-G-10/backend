import { validationResult } from "express-validator";
import queries from "../database/queries";
import { Request, Response } from "express";
import dbAPI from "../database/database";
import { Path } from "../model/Paths";
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
    const trx = await dbAPI.start();

    const sistemChanges = await queries.returnCantOfSistemsChangesOfAnySystemForId(
      systemId,
      trx
    );
    dbAPI.commit(trx);
    const sc = sistemChanges ? sistemChanges : 0;
    if (sc === 0) {
      queries
        .update("`system`", "id", {
          set: key + " = '" + value + "'",
          id: systemId,
        })
        .then((ok) => console.log("modificó bien?", ok));

      res.json({ redirect: Path.ADMINSYS});
    }
  } catch (error) {
    return res.status(400);
  }
};
export default editStructure;
