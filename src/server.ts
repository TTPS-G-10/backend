import express from "express";
import auth from "./routes/auth";
import logOut from "./routes/logOut";
import patients from "./routes/patients";
import adminsys from "./routes/adminsys";
import systems from "./routes/systems";
import bed from "./routes/bed";
import beds from "./routes/beds";
import room from "./routes/room";
import rooms from "./routes/rooms";
import system from "./routes/system";
import patient from "./routes/patient";
import doctors from "./routes/doctors";
import internment from "./routes/internment";
import systemChange from "./routes/systemChange";

import morgan from "morgan";
import cors from "cors";
import dbAPI from "./DAL/database";
import authorization from "./middlewares/authorization";
import cookieParser from "cookie-parser";
import fs from "fs";
import https from "https";

const key = fs.readFileSync(__dirname + "/../.certificates/localhost.key");
const cert = fs.readFileSync(__dirname + "/../.certificates/localhost.crt");
const options = {
  key: key,
  cert: cert,
};

const app = express();
app.use(express.json());
app.use(cookieParser());

var corsOptions = {
  origin: "https://localhost:3000",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(morgan("dev")); // it's a module that allows you to view http request by console
app.use(authorization);
app.use(auth);
app.use(logOut);
app.use(patients);
app.use(adminsys);
app.use(systems);
app.use(patient);
app.use(bed);
app.use(beds);
app.use(internment);
app.use(room);
app.use(rooms);
app.use(system);
app.use(doctors);
app.use(systemChange);

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

var server = https.createServer(options, app);

server.listen(app.get("port"), () => {
  console.log("Server on port: ", app.get("port"));
});

export default app;
