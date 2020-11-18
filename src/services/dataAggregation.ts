import dbAPI from "../database/database";
import queries from "../database/queries";
import { Room } from "../model/Room";
import { User } from "../model/User";
import { System } from "../model/System";
import { Bed } from "../model/Bed";
import { Patient } from "../model/Patient";
import { Evolution } from "../model/Evolution";
import systems from "../controllers/adminsys";

const addSystemData = async (system: System) => {
  system.totalBeds = system.totalBeds ? system.totalBeds : 0;
  system.ocupedBeds = system.ocupedBeds ? system.ocupedBeds : 0;
  if (system.totalBeds === 0) {
    system.occupancy = 100;
    system.freeBeds = 0;
  } else {
    system.occupancy = (100 / system.totalBeds) * system.ocupedBeds;
    system.freeBeds = system.totalBeds - system.ocupedBeds;
  }
  return { ...system };
};

const addSystemRetirable = async (system: System) => {
  const trx = await dbAPI.start();
  const cant = await queries.returnCantOfSistemsChangesOfAnySystemForId(
    system.id,
    trx
  );
  await dbAPI.commit(trx);
  if (cant?.cant === 0) {
    system.retirable = true;
  } else {
    system.retirable = false;
  }
  return { ...system, retirable: system.retirable };
};

const addBedsAndPatientsToRoom = async (room: Room) => {
  const trx = await dbAPI.start();
  const patients = await queries.returnBedsAnDPatientsForRoomId(room.id, trx);
  await dbAPI.commit(trx);
  return { ...room, patients };
};
const addBedsToRoom = async (room: Room) => {
  const trx = await dbAPI.start();
  const beds = await queries.returnBedsOfAnyRoomForId(room.id, trx);
  await dbAPI.commit(trx);
  return { ...room, beds: beds };
};
const addBedsWithPatientToRoom = async (room: Room) => {
  const trx = await dbAPI.start();
  const beds = await queries.returnBedsOfAnyRoomForId(room.id, trx);
  const bedsWithPatients = await Promise.all(beds.map(addPatientToBed));
  await dbAPI.commit(trx);
  return { ...room, beds: bedsWithPatients };
};

const addPatientToBed = async (bed: Bed) => {
  const trx = await dbAPI.start();
  const patient = await queries.returnPatientForBed(bed.id, trx);
  await dbAPI.commit(trx);
  return {
    ...bed,
    patient_id: patient?.id,
    patient_name: patient?.name,
    patient_last_name: patient?.lastName,
  };
};

const addRoomsAndBedsToSystem = async (system: System) => {
  await addSystemData(system);
  await addSystemRetirable(system);
  const trx = await dbAPI.start();
  const rooms = await queries.returnRomsOfAnSystemForId(system.id, trx);
  const roomsWithBeds = await Promise.all(rooms.map(addBedsToRoom));

  await dbAPI.commit(trx);
  return { ...system, rooms: roomsWithBeds };
};

const addRoomsAndBedsAndPatientsToSystem = async (system: System) => {
  addSystemData(system);
  const trx = await dbAPI.start();
  const rooms = await queries.returnRomsOfAnSystemForId(system.id, trx);
  const roomsWithBeds = await Promise.all(rooms.map(addBedsWithPatientToRoom));
  await dbAPI.commit(trx);
  return { ...system, rooms: roomsWithBeds };
};

export {
  addBedsAndPatientsToRoom,
  addBedsWithPatientToRoom,
  addRoomsAndBedsToSystem,
  addRoomsAndBedsAndPatientsToSystem,
};
