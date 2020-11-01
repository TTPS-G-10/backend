"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mainpage_1 = __importDefault(require("./../controllers/mainpage"));
var express_1 = __importDefault(require("express"));
var router = express_1.default();
router.get('/init', mainpage_1.default);
exports.default = router;
