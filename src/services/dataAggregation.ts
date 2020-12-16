import dbAPI from "../DAL/database";
import queries from "../DAL/queries";
import { Room } from "../model/Room";
import { Internment } from "../model/Internment";
import { SystemChange } from "../model/SystemChange";
import { Patient } from "../model/Patient";
import { System } from "../model/System";
import { Bed } from "../model/Bed";
import { Evolution } from "../model/Evolution";

const calculateOcupancyAndFreeBeds = async (system: System) => {
  system.totalBeds = system.totalBeds ? system.totalBeds : 0;
  system.ocupedBeds = system.ocupedBeds ? system.ocupedBeds : 0;
  if (system.totalBeds === 0) {
    system.occupancy = 100;
    system.freeBeds = 0;
  } else {
    system.occupancy = (100 / system.totalBeds) * system.ocupedBeds;
    system.freeBeds = system.totalBeds - system.ocupedBeds;
  }
  return { ...system, occupancy: system.occupancy, freeBeds: system.freeBeds };
};

const calculateRemovableProperty = async (system: System) => {
  const result = await queries.returnCantOfSistemsChangesOfAnySystemForId(
    system.id
  );
  const cantOfRoms = await queries.returnRomsOfAnSystemForId(system.id);
  if (result?.cant === 0 && cantOfRoms.length === 0) {
    system.removable = true;
  } else {
    system.removable = false;
  }
  return { ...system, removable: system.removable };
};

const addBedsAndPatientsToRoom = async (room: Room) => {
  const bedsOfPatients = await queries.returnBedsAndPatientsForRoomId(room.id);
  const patients = await Promise.all(bedsOfPatients.map(addPatientToBed));
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
  const patient = await queries.findPatientByID(bed.patientId);
  const internment = await queries.findOpenInternmentWithPatientId(
    bed.patientId
  );
  return {
    ...bed,
    internmentId: internment?.id,
    patientName: patient?.name,
    patientLastName: patient?.lastName,
  };
};

const addRoomsAndBedsToSystem = async (system: System) => {
  await calculateOcupancyAndFreeBeds(system);
  await calculateRemovableProperty(system);
  const rooms = await queries.returnRomsOfAnSystemForId(system.id);
  const roomsWithBeds = await Promise.all(rooms.map(addBedsToRoom));
  return { ...system, rooms: roomsWithBeds };
};

const addRoomsAndBedsAndPatientsToSystem = async (system: System) => {
  await calculateOcupancyAndFreeBeds(system);
  const rooms = await queries.returnRomsOfAnSystemForId(system.id);
  const roomsWithBeds = await Promise.all(rooms.map(addBedsWithPatientToRoom));
  return { ...system, rooms: roomsWithBeds };
};

const addSystemchangesAndEvaluationToInternment = async (
  internment: Internment
) => {
  const systemChanges: SystemChange[] = await queries.findSystemChangesOfInternmentWithInternmentId(
    internment.id
  );
  const systemChangesWithEvaluations = await Promise.all(
    systemChanges.map(addEvaluationsToSystemChanges)
  );
  const patient = await queries.findPatientByID(internment.patientId);

  const location = await queries.LocationOfPatientWithPatientId(
    internment.patientId
  );
  patient ? (internment.patient = patient) : patient;
  location ? (internment.location = location) : location;
  internment.systemChanges = systemChangesWithEvaluations;
  return { ...internment };
};

const addEvaluationsToSystemChanges = async (systemChange: SystemChange) => {
  const evaluations: Evolution[] = await queries.findAcotedEvaluationsOfSystemChangeWithSystemChangeId(
    systemChange.id
  );
  return { ...systemChange, evaluations: evaluations };
};

export {
  addSystemchangesAndEvaluationToInternment,
  addBedsAndPatientsToRoom,
  addBedsWithPatientToRoom,
  addRoomsAndBedsToSystem,
  addRoomsAndBedsAndPatientsToSystem,
};
