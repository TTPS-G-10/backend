import newStructureSystem from "../controllers/newStructureSystem";
import deleteStructureSystem from "./../controllers/deleteStructureSystem";
import editStructureSystem from "./../controllers/editStructureSystem";
import Router from "express";
const router = Router();
const { check } = require("express-validator");

router.post(
  "/system",
  [check("nombre", "El nombre es obligatorio").not().isEmpty()],

  newStructureSystem
);

router.delete(
  "/system",
  check("systemId", "El id del systema es obligatorio").not().isEmpty(),
  deleteStructureSystem
);
router.put(
  "/system",
  [
    check("value", "El valor es obligatorio").not().isEmpty(),
    check("key", "El identificador es obligatorio").not().isEmpty(),
    check("systemId", "El id del systema es obligatorio").not().isEmpty(),
  ],
  editStructureSystem
);

export default router;
