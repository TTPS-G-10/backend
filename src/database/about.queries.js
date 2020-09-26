var connection = require('./database'); 
const aboutQueries ={};

aboutQueries.doctors= () => { //it's just an example
    conection.query('SELECT * FROM doctors',(err,rows,fields)=>{
        if(!err){
            return json(rows);
        }else{
           return console.log(err);
        }
    });
}

module.exports = aboutQueries;