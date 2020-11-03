const dbAPI = require("../database/database");
const queries = require("../database/queries");
const { json } = require("express");

const patients = async (req, res) => {
  console.log("desde main");
  console.log(req.body);

  /**
   * read JWT to find user kind
   */
  const trx = await dbAPI.start();
  const user = await queries.findUserByEmail("javier@gmail.com", trx);
  system = await queries.findSystemOfUser("javier@gmail.com", trx);
  user.system_name =system.system_name
  const patients = await queries.returnPatientsOfAnSystemForName(user.system_name, trx);
  const rooms_names = await queries.returnRomsOfAnSystemForName(user.system_name, trx);
  await dbAPI.commit(trx);
  
  let rooms = []

  rooms_names.forEach(function(name) {
    let listOfPatiens=[]
    patients.forEach(function(patient) {
      if (name.room_name == patient.room_name) {
        listOfPatiens.push(patient)}
    })
    name.patients = listOfPatiens
    rooms.push( name );
  })
  res.json({
    user,rooms
  });
};
module.exports = patients;
