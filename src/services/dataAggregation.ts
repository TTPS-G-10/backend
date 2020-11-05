import dbAPI from "../database/database";
import queries from "../database/queries";
import { Room } from "../model/Room";
import { User } from "../model/User";
import { System } from "../model/System";
import { Bed } from "../model/Bed";
import { Patient } from "../model/Patient";
import { Evolution } from "../model/Evolution";
import systems from "../controllers/adminsys";

const addPatientsToRoom = async (room: Room) => {
  const trx = await dbAPI.start();
  const patients = await queries.returnPatientsForRoom(room.id, trx);
  await dbAPI.commit(trx);
  return { ...room, patients };
};
const addBedsToRoom = async (room: Room) => {
  const trx = await dbAPI.start();
  const beds = await queries.returnBedsForRoom(room.id, trx);
  const bedsWithPatients = await Promise.all(beds.map(addPatientsToBed));
  await dbAPI.commit(trx);
  return { ...room, beds: bedsWithPatients };
};

const addPatientsToBed = async (bed: Bed) => {
  const trx = await dbAPI.start();
  const patient = await queries.returnPatientForBed(bed.id, trx);
  await dbAPI.commit(trx);
  return {
    ...bed,
    patient_id: patient?.id,
    patient_name: patient?.name,
    patient_last_name: patient?.last_name,
  };
};

const addRoomsAndPatientsToSystem = async (system: System) => {
  const trx = await dbAPI.start();
  const rooms = await queries.returnRomsOfAnSystemForId(system.id, trx);
  const roomsWithBeds = await Promise.all(rooms.map(addBedsToRoom));
  await dbAPI.commit(trx);
  return { ...system, rooms: roomsWithBeds };
}; /*
const addRoomsAndPatientsToSystem = async (system: System) => {
  const trx = await dbAPI.start();
  const aux = await queries.returnRomsOfAnSystemForId(system.id, trx);
  const aux1 = await Promise.all(aux.map(addPatientsToRoom));
  console.log("aux1", aux1);
  const rooms = await Promise.all(aux1.map(addBedsWithoutPatientsToRoom));
  await dbAPI.commit(trx);
  return { ...system, rooms };
};*/

export { addPatientsToRoom, addRoomsAndPatientsToSystem };
