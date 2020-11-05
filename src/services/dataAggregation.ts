import dbAPI from "../database/database";
import queries from "../database/queries";
import { Room } from "../model/Room";
import { User } from "../model/User";
import { System } from "../model/System";
import { Bed } from "../model/Bed";
import { Patient } from "../model/Patient";
import { Evolution } from "../model/Evolution";

const addPatientsToRoom = async (room: Room) => {
    const trx = await dbAPI.start();
    const patients = await queries.returnPatientsForRoom(room.id, trx);
    await dbAPI.commit(trx);
    return { ...room, patients };
}

const addRoomsAndPatientsToSystem = async (system: System) => {
    const trx = await dbAPI.start();
    const aux = await queries.returnRomsOfAnSystemForId(system.id, trx);
    const rooms = await Promise.all(aux.map(addPatientsToRoom));
    await dbAPI.commit(trx);
    return { ...system, rooms };
}

const addBedsWithoutPatientsToRoom = async (room: Room) => {
    const trx = await dbAPI.start();
    const beds = await queries.returnBedsWithoutPatientsOfAnyRoomForId(room.id, trx);
    await dbAPI.commit(trx);
    return { ...room, beds };
}


export { addPatientsToRoom,
 addRoomsAndPatientsToSystem,
addBedsWithoutPatientsToRoom };