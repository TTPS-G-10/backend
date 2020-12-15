import express, { Response } from "express";
import alerts from "./routes/alerts";
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
import doctor from "./routes/doctor";
import internment from "./routes/internment";
import evolution from "./routes/evolution";
import systemChange from "./routes/systemChange";

import morgan from "morgan";
import cors from "cors";
import dbAPI from "./DAL/database";
import authorization from "./middlewares/authorization";
import cookieParser from "cookie-parser";
import fs from "fs";
import https from "https";
import EngineRule from "./rule-engine/engine";

const key = fs.readFileSync("src/certificates/localhost.key");
const cert = fs.readFileSync("src/certificates/localhost.crt");
import http from "http";

const config = require("config");

const options = {
  key: key,
  cert: cert,
};

const app = express();
app.use(express.json());
app.use(cookieParser());

const origin =
  process.env.NODE_ENV === "production"
    ? "https://frontend.ttps-g-10.vercel.app/"
    : "https://localhost:3000";

var corsOptions = {
  origin,
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));
app.options("*", (req, res: Response) => res.sendStatus(200));

app.get("/healthcheck", (req, res) => {
  console.log("entro al healthcheck");
  res.sendStatus(200);
});
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
app.use(evolution);
app.use(doctors);
app.use(doctor);
app.use(systemChange);
app.use(alerts);

app.set("port", process.env.PORT || 9000);

// create the connection to database
const dbConfig = config.get("dbConfig");
console.log("DB: ", dbConfig);
dbAPI.generateConnection(dbConfig).then(() => {
  console.log("Conection Success");
  EngineRule.init();
});

var server =
  process.env.NODE_ENV == "production"
    ? http.createServer(app)
    : https.createServer(options, app);

server.listen(app.get("port"), () => {
  console.log("Server on port: ", app.get("port"));
});

export default app;
