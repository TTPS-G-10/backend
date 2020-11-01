"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_1 = __importDefault(require("./routes/auth"));
var main_1 = __importDefault(require("./routes/main"));
var logOut_1 = __importDefault(require("./routes/logOut"));
var morgan_1 = __importDefault(require("morgan"));
var cors_1 = __importDefault(require("cors"));
var database_1 = __importDefault(require("./database/database"));
var app = express_1.default();
app.use(express_1.default.json());
// get the client
var mysql = require("mysql2");
var corsOptions = {
    origin: "http://localhost:3000",
};
app.use(cors_1.default(corsOptions));
app.use(morgan_1.default("dev")); // it's a module that allows you to view http request by console
app.use(auth_1.default);
app.use(main_1.default);
app.use(logOut_1.default);
app.set("port", process.env.PORT || 8080);
// create the connection to database
// @todo sacar estos datos de configuración por ambiente
database_1.default.generateConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "ttps_db",
    port: 3306,
});
app.listen(app.get("port"), function () {
    console.log("Server on port: ", app.get("port"));
});
exports.default = app;
