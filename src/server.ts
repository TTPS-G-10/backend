import express from "express";
import auth from "./routes/auth";
import logOut from "./routes/logOut";
import patients from "./routes/patients";
import adminsys from "./routes/adminsys";
import systems from "./routes/systems";

import bed from "./routes/bed";
import room from "./routes/room";
import system from "./routes/system";

import morgan from "morgan";
import cors from "cors";
import dbAPI from "./database/database";
import queries from "./database/queries";

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
app.use(logOut);
app.use(patients);
app.use(adminsys);
app.use(systems);
app.use(bed);
app.use(room);
app.use(system);

app.set("port", process.env.PORT || 9000);

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
