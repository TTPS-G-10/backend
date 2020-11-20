import dbAPI from "../database/database";
import queries from "../database/queries";
import { Room } from "../model/Room";
import { System } from "../model/System";
import { Bed } from "../model/Bed";

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
  const cant = await queries.returnCantOfSistemsChangesOfAnySystemForId(
    system.id
  );
  if (cant?.cant === 0) {
    system.retirable = true;
  } else {
    system.retirable = false;
  }
  return { ...system, retirable: system.retirable };
};

const addBedsAndPatientsToRoom = async (room: Room) => {
  const patients = await queries.returnBedsAnDPatientsForRoomId(room.id);
  return { ...room, patients };
};
const addBedsToRoom = async (room: Room) => {
  const beds = await queries.returnBedsOfAnyRoomForId(room.id);
  return { ...room, beds: beds };
};
const addBedsWithPatientToRoom = async (room: Room) => {
  const beds = await queries.returnBedsOfAnyRoomForId(room.id);
  const bedsWithPatients = await Promise.all(beds.map(addPatientToBed));
  return { ...room, beds: bedsWithPatients };
};

const addPatientToBed = async (bed: Bed) => {
  const patient = await queries.returnPatientForBed(bed.id);
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
  const rooms = await queries.returnRomsOfAnSystemForId(system.id);
  const roomsWithBeds = await Promise.all(rooms.map(addBedsToRoom));
  return { ...system, rooms: roomsWithBeds };
};

const addRoomsAndBedsAndPatientsToSystem = async (system: System) => {
  addSystemData(system);
  const rooms = await queries.returnRomsOfAnSystemForId(system.id);
  const roomsWithBeds = await Promise.all(rooms.map(addBedsWithPatientToRoom));
  return { ...system, rooms: roomsWithBeds };
};

export {
  addBedsAndPatientsToRoom,
  addBedsWithPatientToRoom,
  addRoomsAndBedsToSystem,
  addRoomsAndBedsAndPatientsToSystem,
};
