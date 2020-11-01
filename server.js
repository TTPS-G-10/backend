const express = require("express");
const about = require("./src/routes/about.routes");
const auth = require("./src/routes/auth");
const patients = require("./src/routes/patients");
const adminsys = require("./src/routes/adminsys");
const morgan = require("morgan");
const app = express();
const cors = require("cors");
const dbAPI = require("./src/database/database");
app.use(express.json({ extended: true }));
var env = require("node-env-file"); //.env file
env(__dirname + "/.env");

// get the client
const mysql = require("mysql2");

var corsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));
app.use(morgan("dev")); // it's a module that allows you to view http request by console
app.use(about);
app.use(auth);
app.use(patients);
app.use(adminsys);
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

module.exports = app;
