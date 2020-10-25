const express= require('express');
const about = require ('./src/routes/about.routes');
const auth = require ('./src/routes/auth');
const morgan = require('morgan');
const app = express();
const cors = require('cors');
var env = require('node-env-file'); //.env file
env(__dirname + '/.env');

var corsOptions = {
    origin: 'http://localhost:3000'
  }
app.use(cors(corsOptions));
app.use(morgan('dev')); // it's a module that allows you to view http request by console
app.use(about);
app.use(auth);
app.set('port', process.env.PORT || 8080);


app.listen(app.get('port'),() =>{
    console.log('Server on port: ',app.get('port'))
})

module.exports = app;