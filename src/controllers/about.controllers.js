var query = require('../database/about.queries');
const aboutCtrl ={};

aboutCtrl.showHi =(req,res)=>{
    res.send('Hello word!');
    
    //in case the answer is something from the DB
    //res.send(query.doctors());
}


module.exports =aboutCtrl;