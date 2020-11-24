import dbAPI from "../database/database";
import queries from "../database/queries";
import { Room } from "../model/Room";
import { Internment } from "../model/Internment";
import { SystemChange } from "../model/SystemChange";
import { Evaluation } from "../model/Evaluation";
import { Patient } from "../model/Patient";
import { System } from "../model/System";
import { Bed } from "../model/Bed";

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
  const systemChangesWhitEvaluations = await Promise.all(
    systemChanges.map(addEvaluationsToSystemChanges)
  );
  const patient = await queries.findPatientByID(internment.patientId);

  const location = await queries.LocationOfPatientWhitPatientId(
    internment.patientId
  );
  patient ? (internment.patient = patient) : patient;
  location ? (internment.location = location) : location;
  internment.systemChanges = systemChangesWhitEvaluations;
  return { ...internment };
};

const addEvaluationsToSystemChanges = async (systemChange: SystemChange) => {
  const evaluations: Evaluation[] = await queries.findAcotedEvaluationsOfSystemChangeWhitSystemChangeId(
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
