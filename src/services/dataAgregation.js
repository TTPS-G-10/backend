const dbAPI = require("../database/database");
const queries = require("../database/queries");

const addPatientsToRoom = async (room)=>{
    const trx = await dbAPI.start();
    const patients = await queries.returnPatientsForRoom(room.room_id, trx)}
    await dbAPI.commit(trx);
    return  {...room,patients}
}  

module.exports ={
    addPatientsToRoom
}
