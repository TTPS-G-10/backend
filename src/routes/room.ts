import newStructureRoom from "../controllers/newStructureRoom";
import deleteStructureRoom from "../controllers/deleteStructureRoom";
import editStructureRoom from "./../controllers/editStructureRoom";
import Router from "express";
const router = Router();
const { check } = require("express-validator");

router.post(
  "/room",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("systemId", "systemId es obligatorio").not().isEmpty(),
  ],
  newStructureRoom
);

router.delete(
  "/room",
  check("roomId", "El id de la sala es obligatorio").not().isEmpty(),
  deleteStructureRoom
);

router.put(
  "/room",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("roomId", "El id de la sala es obligatorio").not().isEmpty(),
  ],
  editStructureRoom
);
export default router;
