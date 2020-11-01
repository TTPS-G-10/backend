const dbAPI = require("../database/database");
const queries = require("../database/queries");

const systems = async (req, res) => {
  /**
   * read JWT to find user kind
   */
  const trx = await dbAPI.start();
  const user = await queries.findUserByEmail("javier@gmail.com", trx);
  const anysystems = await queries.returnSystems( trx);
  const anyroom = await queries.returnRooms( trx);
  const anybed = await queries.returnBedsWithoutPatients( trx);
  const anybedandPatient = await queries.returnBedsAndPatiens( trx);
  await dbAPI.commit(trx);

  

  let systems = []

  anysystems.forEach(function(system) {

    let rooms=[]
    anyroom.forEach(function(room) {
        if (room.system_id == system.system_id) {
            
            let beds=[]

            anybedandPatient.forEach(function(bedpat) {
                if (bedpat.room_id == room.room_id) {
                    beds.push(bedpat)}
            })       
            anybed.forEach(function(bed) {
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
module.exports = systems;