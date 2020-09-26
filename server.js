const express= require('express');
const about = require ('./src/routes/about.routes');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev')); // it's a module that allows you to view http request by console
app.use(about);
app.set('port', process.env.PORT || 8080);



module.exports = app;