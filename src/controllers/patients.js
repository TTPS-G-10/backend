const dbAPI = require("../database/database");
const queries = require("../database/queries");
const { json } = require("express");
const app = require("../../server");

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
  const rooms = await queries.returnRomsOfAnSystemForName(user.system_name, trx);

  
  const finaldata = await Promise.all( rooms.map(async function(room) {
       return  {...room,patients:await queries.returnPatientsForRoom(room.room_id, trx)}
  }))
  await dbAPI.commit(trx);
console.log(finaldata);
  res.json({
    user,rooms:finaldata
  });
};
module.exports = patients;
