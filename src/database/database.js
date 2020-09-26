var mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'password',
    database:'hospital'
});
//adapt the connection once the DB is made

/*
connection.connect( function(err){
    if(err){
        console.log(err);
        return;
    }else{
        console.log('Connected to the database');
    }
});*/

module.exports = connection;