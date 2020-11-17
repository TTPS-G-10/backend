import searchPattient from "../controllers/searchPatient";
import Router from "express";
import { check } from "express-validator";
const router = Router();

router.post(
  "/addPatient",
  [
    check("dni", "El DNI es obligatorio").not().isEmpty(),
    check("dni", "El DNI tiene que ser un numero").isNumeric(),
    check("dni", "El DNI tiene que tener minimo 6 digitos").isLength({
      min: 6,
    }),
  ],
  searchPattient
);

export default router;
