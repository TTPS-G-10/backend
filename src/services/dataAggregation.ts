import dbAPI from "../database/database";
import queries from "../database/queries";
import { Room } from "../model/Room";

const addPatientsToRoom = async (room: Room) => {
    const trx = await dbAPI.start();
    const patients = await queries.returnPatientsForRoom(room.id, trx);
    await dbAPI.commit(trx);
    return { ...room, patients };
}
export { addPatientsToRoom };
