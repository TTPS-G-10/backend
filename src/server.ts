<<<<<<< HEAD:server.js
const express = require("express");
const about = require("./src/routes/about.routes");
const auth = require("./src/routes/auth");
<<<<<<< HEAD
const mainpage = require("./src/routes/main");
const logOut = require("./src/routes/logOut");
=======
const patients = require("./src/routes/patients");
const adminsys = require("./src/routes/adminsys");
const systems = require("./src/routes/systems");
>>>>>>> 90458f689b09de1775c0db5cc407ef6deed7aa0f
const morgan = require("morgan");
=======
import express from "express";
import auth  from "./routes/auth";
import mainpage from "./routes/main";
import logOut from "./routes/logOut";
import morgan from "morgan";
import cors from "cors";
import dbAPI from "./database/database";

>>>>>>> issues/2/typescript-interfaces:src/server.ts
const app = express();
app.use(express.json());


// get the client
const mysql = require("mysql2");

var corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));
app.use(morgan("dev")); // it's a module that allows you to view http request by console
app.use(auth);
app.use(mainpage);
app.use(logOut);
app.use(patients);
app.use(adminsys);
app.use(systems);
app.set("port", process.env.PORT || 8080);

// create the connection to database
// @todo sacar estos datos de configuración por ambiente
dbAPI.generateConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "ttps_db",
  port: 3306,
});

app.listen(app.get("port"), () => {
  console.log("Server on port: ", app.get("port"));
});

export default app;
