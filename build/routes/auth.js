"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var auth_1 = __importDefault(require("./../controllers/auth"));
var express_1 = __importDefault(require("express"));
var router = express_1.default();
var check = require("express-validator").check;
router.post("/authenticate", [
    check("email", "El email es obligatorio").not().isEmpty(),
    check("email", "El email es invalido").isEmail(),
    check("password", "La contraseña debe tener como minimo 6 caracteres").isLength({ min: 6 }),
], auth_1.default);
exports.default = router;
