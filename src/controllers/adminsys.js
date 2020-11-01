const dbAPI = require("../database/database");
const queries = require("../database/queries");

const adminsys = async (req, res) => {
  /**
   * read JWT to find user kind
   */
  const trx = await dbAPI.start();
  const user = await queries.findUserByEmail("admin@gmail.com", trx);
  const adminsystems = await queries.returnSystemForAdmin( trx);
  const adminroom = await queries.returnRoomForAdmin( trx);
  const adminbed = await queries.returnBedForAdmin( trx);
  await dbAPI.commit(trx);

  

  let systems = []

  adminsystems.forEach(function(system) {

    let rooms=[]
    adminroom.forEach(function(room) {
        if (room.system_id == system.system_id) {

        let beds=[]
        adminbed.forEach(function(bed) {
            if (bed.room_id == room.room_id) {
                beds.push(bed)}
        
        })
        room.beds = beds    
        rooms.push(room)


    }})
    system.rooms = rooms
    systems.push(system) 
  })
console.log(systems);
  res.json({
    user,systems
  });
};
module.exports = adminsys;