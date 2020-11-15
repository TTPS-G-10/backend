import newStructureBed from "./../controllers/newStructureBed";
import deleteStructureBed from "./../controllers/deleteStructureBed";
import editStructureBed from "./../controllers/editStructureBed";
import Router from "express";
const router = Router();
const { check } = require("express-validator");

router.post(
  "/bed",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("roomId", "El id de la cama es obligatorio").not().isEmpty(),
  ],
  newStructureBed
);

router.delete(
  "/bed",
  [check("bedId", "El id de la cama es obligatorio").not().isEmpty()],
  deleteStructureBed
);

router.put(
  "/bed",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("bedId", "El id de la cama es obligatorio").not().isEmpty(),
  ],
  editStructureBed
);
export default router;
