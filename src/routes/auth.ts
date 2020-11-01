import auth from "./../controllers/auth";
import Router from "express";
const router = Router();
const { check } = require("express-validator");

router.post(
  "/authenticate",
  [
    check("email", "El email es obligatorio").not().isEmpty(),
    check("email", "El email es invalido").isEmail(),
    check(
      "password",
      "La contraseña debe tener como minimo 6 caracteres"
    ).isLength({ min: 6 }),
  ],
  auth
);

export default router;
