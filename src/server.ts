import express from "express";
import auth  from "./routes/auth";
import mainpage from "./routes/main";
import logOut from "./routes/logOut";
import morgan from "morgan";
import cors from "cors";
import dbAPI from "./database/database";

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
