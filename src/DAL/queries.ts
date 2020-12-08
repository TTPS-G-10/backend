import dbAPI from "./database";
import { User } from "../model/User";
import { System } from "../model/System";
import { Internment } from "../model/Internment";
import { Patient } from "../model/Patient";
import { Location } from "../model/Location";
import { ContactPerson } from "../model/ContactPerson";
import { Evaluation } from "../model/Evaluation";
import { Evolution } from "../model/Evolution";
import { Bed } from "../model/Bed";

type Cant = {
  cant: Number;
};

const findUserByEmail = async (email: string): Promise<User | null> => {
  const sql = `
    SELECT *
    FROM ttps_db.user user
    WHERE email = ?
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<User | null>(sql, [email]);
};
const findUserById = async (id: number): Promise<User | null> => {
  const sql = `
    SELECT *
    FROM ttps_db.user user
    WHERE id = ?
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<User | null>(sql, [id]);
};

const findPatientByDNI = async (dni: number): Promise<Patient | null> => {
  const sql = `
    SELECT *
    FROM ttps_db.patient
    WHERE dni =	?
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<Patient | null>(sql, [dni]);
};

const findPatientByID = async (id: number): Promise<Patient | null> => {
  const sql = `
    SELECT *
    FROM ttps_db.patient
    WHERE id =	?
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<Patient | null>(sql, [id]);
};
const findContactPersonByPatientID = async (
  idPatient: number
): Promise<ContactPerson | null> => {
  const sql = `
    SELECT *
    FROM ttps_db.contactPerson
    WHERE patientID =	?
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<ContactPerson | null>(sql, [idPatient]);
};

const lastEvolveByPatientID = async (
  idPatient: number
): Promise<Evaluation | null> => {
  const sql = `SELECT *
                FROM evaluation
                WHERE patientId=? AND id=(SELECT MAX(id)
                                          FROM evaluation wHERE patientId=?
                )
                LIMIT 1`;
  return await dbAPI.singleOrDefault<Evaluation | null>(sql, [
    idPatient,
    idPatient,
  ]);
};

const LocationOfPatientWithPatientId = async (
  idPatient: number
): Promise<Location | null> => {
  const sql = `
  SELECT system.id as systemId, system.name as systemName, room.id as roomId, room.name as roomName,bed.id as bedId, bed.name as bedName
    FROM ttps_db.system 
        INNER JOIN ttps_db.room on  system.id = room.systemId 
        INNER JOIN ttps_db.bed on  room.id = bed.roomId
        INNER JOIN ttps_db.patient on  bed.patientId = patient.id
        WHERE patient.id = ?
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<Location | null>(sql, [idPatient]);
};

const findSystemOfUser = async (email: string): Promise<System | null> => {
  const sql = `
    SELECT sys.name , sys.id
    FROM ttps_db.user user
    INNER JOIN ttps_db.worksAt wa on user.id = wa.userId
    INNER JOIN ttps_db.system sys on wa.systemId = sys.id
    WHERE email = ?
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<System | null>(sql, [email]);
};
const findSystemForEvolution = async (id: number): Promise<String | null> => {
  const sql = `
    SELECT syst.name
    FROM ttps_db.system as syst
    INNER JOIN ttps_db.systemChange as sc
    ON syst.id = sc.systemId
    WHERE sc.id='?'
    LIMIT 1
    `;
  return await dbAPI.singleOrDefault<String | null>(sql, [id]);
};

const findSystemOfUserForId = async (id: number): Promise<System | null> => {
  const sql = `
    SELECT sys.name , sys.id
    FROM ttps_db.worksAt 
    INNER JOIN ttps_db.system sys on worksAt.systemId = sys.id
    WHERE worksAt.userId = ?
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<System | null>(sql, [id]);
};

const findSystemChiefBySystemId = async (
  systemId: number
): Promise<User | null> => {
  const sql = `
    SELECT user.id,user.name,user.lastName,user.file,user.email
    FROM ttps_db.user
    INNER JOIN ttps_db.worksAt on worksAt.userId = user.id
    WHERE user.role = "JEFE DE SISTEMA" AND worksAt.systemId = ?
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<User | null>(sql, [systemId]);
};

const findInternmentWithId = async (
  patientId: number
): Promise<Internment | null> => {
  const sql = `
 SELECT internment.*
    FROM ttps_db.internment
    WHERE (id = ?) AND (egressDate IS NULL) AND  (obitoDate IS NULL)
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<Internment | null>(sql, [patientId]);
};

const findOpenInternmentWithPatientId = async (
  patientId: number
): Promise<Internment | null> => {
  const sql = `
 SELECT internment.*
    FROM ttps_db.internment
    INNER JOIN ttps_db.patient ON patient.id = internment.patientId
    WHERE (patient.id = ?) AND (internment.egressDate IS NULL) AND  (internment.obitoDate IS NULL)
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<Internment | null>(sql, [patientId]);
};

const findSystemForName = async (
  systemName: string
): Promise<System | null> => {
  const sql = `
  SELECT *
        FROM ttps_db.system 
        WHERE system.name = ?
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<System | null>(sql, [systemName]);
};

const findSystemChangesOfInternmentWithInternmentId = async (
  internmentId: number
) => {
  const sql = `
  SELECT systemChange.*,system.name as systemName
    FROM ttps_db.systemChange
    INNER JOIN ttps_db.internment ON systemChange.internmentId = internment.id
    INNER JOIN ttps_db.system ON systemChange.systemId = system.id
    WHERE (internment.id = ?)
    ORDER BY createtime desc
    `;
  return await dbAPI.rawQuery(sql, [internmentId]);
};

const returnPatientsAssinedToUserById = async (userId: number) => {
  const sql = `
  SELECT patient.name as patientName,internment.id as internmentId,patient.lastName as patientLastName,patient.id as patientId
    FROM ttps_db.user
    INNER JOIN ttps_db.assignedDoctor on assignedDoctor.userId = user.id
    INNER JOIN ttps_db.internment on internment.id= assignedDoctor.internmentId
    INNER JOIN ttps_db.patient on internment.id = patient.id
    WHERE user.id= ?
    `;
  return await dbAPI.rawQuery(sql, [userId]);
};

const findAcotedEvaluationsOfSystemChangeWithSystemChangeId = async (
  internmentId: number
) => {
  const sql = `
SELECT evaluation.id, evaluation.userId, evaluation.patientId, evaluation.systemChangeId, evaluation.createTime
    FROM ttps_db.evaluation
    INNER JOIN ttps_db.systemChange ON systemChange.Id = evaluation.systemChangeId
    WHERE (systemChange.id = ?)
    ORDER BY createTime desc
    `;
  return await dbAPI.rawQuery(sql, [internmentId]);
};

//SYSTEMAS / SALAS / CAMAS / PACIENTES

const findBedsWithSystemAndRoom = async (
  systemId: number,
  roomId: number
): Promise<Bed | null> => {
  const sql = `
    SELECT bd.*
        FROM ttps_db.system sys 
        INNER JOIN ttps_db.room rm on  sys.id = rm.systemId 
        INNER JOIN ttps_db.bed bd on  rm.id = bd.roomId
        WHERE  (sys.id = ?) AND (rm.id = ?) AND (bd.patientId is NULL)
        LIMIT 1
    `;
  return await dbAPI.singleOrDefault<Bed | null>(sql, [systemId, roomId]);
};

const returnBedsWithSpaceOfRoomForRoomId = async (id: Number) => {
  const sql = `
         SELECT bd.name,bd.id
        FROM ttps_db.bed bd 
        WHERE (bd.roomId='?') AND (bd.patientId is NULL)
        GROUP BY bd.id
    `;
  const result = await dbAPI.rawQuery(sql, [id]);
  return result;
};

const returnSystems = async () => {
  const sql = `
      SELECT count(case when bd.patientId is not null then 1 end) as ocupedBeds, 
      count(bd.Id) as totalBeds, sys.name,sys.id,sys.infinitBeds
        FROM ttps_db.system sys 
        INNER JOIN ttps_db.room rm on  sys.id = rm.systemId 
        INNER JOIN ttps_db.bed bd on  rm.id = bd.roomId
        group by sys.id
      union(
      SELECT  0  as ocupedBeds, 0 as totalBeds, sys.name,sys.id,sys.infinitBeds
        FROM ttps_db.system sys 
        WHERE (sys.id) not in

      ( SELECT sys.id
        FROM ttps_db.system sys 
        INNER JOIN ttps_db.room rm on  sys.id = rm.systemId 
        INNER JOIN ttps_db.bed bd on  rm.id = bd.roomId
      )
      ) 
    `;

  const result = await dbAPI.rawQuery(sql, []);
  return result;
};

const returnCantOfSistemsChangesOfAnySystemForId = async (id: Number) => {
  const sql = `
 SELECT count(case when sc.systemId is not null then 1 end) as cant
  FROM ttps_db.systemChange sc
   WHERE sc.systemId = ?
  `;
  return await dbAPI.singleOrDefault<Cant>(sql, [id]);
};

const returnRomsOfAnSystemForId = async (id: Number) => {
  const sql = `
  SELECT  rm.name ,rm.id
  FROM ttps_db.system sys 
  INNER JOIN ttps_db.room rm on  sys.id = rm.systemId 
  WHERE sys.id = ?
  ORDER BY rm.name asc
  `;
  return await dbAPI.rawQuery(sql, [id]);
};

const returnBedsOfAnyRoomForId = async (id: Number) => {
  const sql = `
    SELECT  bd.name , bd.id , bd.patientId
    FROM  ttps_db.room rm 
    INNER JOIN ttps_db.bed bd on  rm.id = bd.roomId
    WHERE rm.id = ?
    ORDER BY bd.name asc
    `;
  return await dbAPI.rawQuery(sql, [id]);
};

const returnPatientForBed = async (idBed: number) => {
  const sql = `
   SELECT pt.id,pt.name ,pt.lastName 
    FROM ttps_db.bed bd 
    INNER JOIN ttps_db.patient pt on  pt.id = bd.patientId
    WHERE bd.id = ? 
    LIMIT 1
    `;
  return await dbAPI.singleOrDefault<Patient | null>(sql, [idBed]);
};

const returnBedsAndPatientsForRoomId = async (id: number) => {
  const sql = `
    SELECT  pt.name as patientName,pt.lastName as patientLastName,pt.id as patientId, bd.name as bedName, bd.id as bedId
    FROM ttps_db.room rm 
    INNER JOIN ttps_db.bed bd on  bd.roomId = rm.id
    INNER JOIN ttps_db.patient pt on  pt.id = bd.patientId
    WHERE rm.id = ? 
    ORDER BY rm.name asc
    `;
  return await dbAPI.rawQuery(sql, [id]);
};

const returCountFreeBedsInSystemId = async (id: number) => {
  try {
    const sql = `
    SELECT COUNT(*) as cantFree
    FROM bed INNER JOIN room ON bed.roomId=room.id
    WHERE patientId is NULL and systemId=?
    `;
    return await dbAPI.rawQuery(sql, [id]);
  } catch (error) {
    return false;
  }
};
const returInfinitBedsOfSystem = async (id: number) => {
  try {
    const sql = `
    SELECT infinitBeds
    FROM ttps_db.system
    WHERE id=?
    `;
    return await dbAPI.rawQuery(sql, [id]);
  } catch (error) {
    return false;
  }
};
const returnRoomsWithSpaceOfSystemForSystemId = async (id: Number) => {
  const sql = `
       SELECT rm.name,rm.id
        FROM ttps_db.room rm 
        INNER JOIN ttps_db.bed bd on rm.id = bd.roomId
        WHERE (rm.systemId=?) AND (bd.patientId is NULL)
        GROUP BY rm.id `;
  const result = await dbAPI.rawQuery(sql, [id]);
  return result;
};
const findRoomsFromASystemtByID = async (id: number) => {
  const sql = `
         SELECT rm.name,rm.id
  FROM  ttps_db.room rm 
  WHERE (rm.systemId='?') 
  GROUP BY rm.id `;

  const result = await dbAPI.rawQuery(sql, [id]);
  return result;
};

const findEvolutionByID = async (id: number) => {
  const sql = `
         SELECT *
  FROM evaluation 
  WHERE id='?' `;

  const result = await dbAPI.singleOrDefault<Evaluation | null>(sql, [id]);
  return result;
};
const returnDoctorsOfSystemForId = async (id: number) => {
  const sql = `
         SELECT user.name,user.lastName,user.id,user.file
    FROM ttps_db.user
    INNER JOIN ttps_db.worksAt ON user.id = worksAt.userId
    WHERE worksAt.systemId = ? AND user.role = "DOCTOR"
    ORDER BY user.lastName desc `;

  const result = await dbAPI.rawQuery(sql, [id]);
  return result;
};

const patientHasCurrentHospitalization = async (idPatient: number) => {
  const sql = `
  SELECT *
  FROM internment
  WHERE egressDate IS NULL AND obitoDate IS NULL AND patientId='?'`;

  const result = await dbAPI.rawQuery(sql, [idPatient]);
  return result;
};

const returnCurrentSystemIdOfTheInternment = async (
  internmentId: number
): Promise<number | null> => {
  const sql = `
  SELECT systemChange.systemId
    FROM ttps_db.systemChange
    INNER JOIN ttps_db.internment ON systemChange.internmentId = internment.id
    WHERE internment.egressDate IS NULL AND internment.obitoDate IS NULL AND internment.id = ? 
    ORDER BY createtime desc
    LIMIT 1`;
  return await dbAPI.singleOrDefault<number | null>(sql, [internmentId]);
};

const stillFreeBed = async (
  idSystem: number,
  idBed: number,
  idRoom: number
) => {
  const sql = `
  SELECT patientId 
  FROM bed
  INNER JOIN room ON bed.roomId = room.Id
  WHERE (room.systemId = '?') AND (bed.id='?') AND (room.id='?')
 `;

  const result = await dbAPI.rawQuery(sql, [idSystem, idBed, idRoom]);
  return result;
};
const createSystemChange = async (internmentId: number, systemId: number) => {
  const sql = `
  INSERT INTO systemChange (internmentId, systemId)
  VALUES (?, ? )
 `;
  const result = await dbAPI.rawQuery(sql, [internmentId, systemId]);
  return result;
};

const createAssignedDoctor = async (internmentId: number, userId: number) => {
  const sql = `
  INSERT INTO assignedDoctor (internmentId, userId)
  VALUES (?, ? )
 `;
  const result = await dbAPI.rawQuery(sql, [internmentId, userId]);
  return result;
};

const createInternment = async (
  historyOfDisease: string,
  dateOfSymptoms: Date,
  dateOfDiagnosis: Date,
  dateOfHospitalization: Date,
  idPatientN: number
) => {
  const sql = `
  INSERT INTO internment (historyOfDisease, dateOfSymptoms, dateOfDiagnosis,dateOfHospitalization, patientId)
  VALUES (?, ?, ?,?, ?)
 `;

  const result = await dbAPI.rawQuery(sql, [
    historyOfDisease,
    dateOfSymptoms,
    dateOfDiagnosis,
    dateOfHospitalization,
    idPatientN,
  ]);
  return result;
};

const unassingPatientToInternment = async (idInternment: number) => {
  const sql = `UPDATE internment SET
                patientId = NULL
                WHERE id = '?'`;
  const result = await dbAPI.rawQuery(sql, [idInternment]);
  return result;
};

const deleteInternment = async (idInternment: number) => {
  const sql = `DELETE FROM internment
              WHERE id = '?'`;
  const result = await dbAPI.rawQuery(sql, [idInternment]);
  return result;
};

const deleteAssignedDoctors = async (idInternment: number) => {
  const sql = `DELETE FROM assignedDoctor
              WHERE internmentId = '?'`;
  const result = await dbAPI.rawQuery(sql, [idInternment]);
  return result;
};

const insert = async (query: string, values: object): Promise<boolean> => {
  try {
    const result = await dbAPI.insert(query, values);
    return true;
  } catch {
    return false;
  }
};

const assignPatientToBed = async (idPatient: number, idBed: number) => {
  const sql = `UPDATE bed
              SET patientId = '?'
              WHERE bed.id='?' `;
  const result = await dbAPI.rawQuery(sql, [idPatient, idBed]);
  return result;
};

const unassingPatientToBed = async (idBed: number) => {
  const sql = `UPDATE bed
               SET patientId = NULL
                WHERE id = '?'`;
  const result = await dbAPI.rawQuery(sql, [idBed]);
  return result;
};
const insertBedWithPatient = async (
  name: string,
  roomId: number,
  patientId: number
) => {
  const sql = `INSERT INTO bed (name,  roomId, patientId)
        VALUES (?, ?, ?)`;
  const result = await dbAPI.rawQuery(sql, [name, roomId, patientId]);
  return result;
};

const removeBed = async (idBed: number) => {
  const sql = `DELETE FROM bed
              WHERE (id = '?')`;
  const result = await dbAPI.rawQuery(sql, [idBed]);
  return result;
};

const removeSystemChange = async (idSystemChange: number) => {
  const sql = `DELETE FROM systemChange
              WHERE (id = '?')`;
  const result = await dbAPI.rawQuery(sql, [idSystemChange]);
  return result;
};

const insertPatient = async (query: string, values: object): Promise<any> => {
  const result = await dbAPI.insert(query, values);
  return result;
};

const insertContactPerson = async (
  query: string,
  values: object
): Promise<any> => {
  const result = await dbAPI.insert(query, values);
  return result;
};
const update = async (
  name: string,
  id: string,
  model: any
): Promise<boolean> => {
  try {
    const result = await dbAPI.update(name, id, model);
    return true;
  } catch {
    return false;
  }
};
const remove = async (
  name: string,
  col: string,
  value: string
): Promise<boolean> => {
  const trx = await dbAPI.start();
  try {
    const result = await dbAPI.remove(name, col, value, trx);
    await trx.commit();
    return result;
  } catch {
    await dbAPI.rollback(trx);
    return false;
  }
};

const getPatientById = async (id: string): Promise<Patient | null> => {
  try {
    const sql = `
    SELECT *
     FROM ttps_db.bed bd 
     INNER JOIN ttps_db.patient pt on  pt.id = bd.patientId
     WHERE bd.id = ? 
     LIMIT 1
     `;
    const result: Patient | null = await dbAPI.singleOrDefault(sql, [id]);
    if (!result) throw new Error("not found");
    return result;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const evolvePatient = async (
  patientId: number,
  userId: number,
  evolution: Evolution,
  systemChangeId: number
): Promise<boolean> => {
  const sql = "INSERT INTO evaluation";
  // @TODO remove this unnecesary field from DB
  //const systemChangeId = 5;
  // -----------------------
  const payload = { ...evolution, userId, patientId, systemChangeId };
  return await insert(sql, payload);
};

const changeRoleOfUserToSystemChief = async (userId: number) => {
  const sql = `UPDATE user
               SET role = "JEFE DE SISTEMA"
                WHERE id = '?'`;
  const result = await dbAPI.rawQuery(sql, [userId]);
  return result;
};

const changeRoleOfUserToDoctor = async (userId: number) => {
  const sql = `UPDATE user
               SET role ="DOCTOR"
                WHERE id = '?'`;
  const result = await dbAPI.rawQuery(sql, [userId]);
  return result;
};

// queries.insert('INSERT INTO bed', { name: 'cama 222', logicDelet: null, roomId: 1, patientId: null }).then((ok) => console.log('insertó bien?', ok));
// queries.update('bed', 'id', { set: "name = 'cama_modificada_1'", id: 1 }).then((ok) => console.log('modificó bien?', ok));
// queries.remove('bed', 'id', '2').then((ok) => console.log('borró bien?', ok));

const queries = {
  changeRoleOfUserToSystemChief,
  returnPatientsAssinedToUserById,
  changeRoleOfUserToDoctor,
  returnDoctorsOfSystemForId,
  returnCurrentSystemIdOfTheInternment,
  findUserByEmail,
  findUserById,
  findBedsWithSystemAndRoom,
  findSystemForName,
  findSystemChiefBySystemId,
  returnBedsWithSpaceOfRoomForRoomId,
  returnRoomsWithSpaceOfSystemForSystemId,
  LocationOfPatientWithPatientId,
  returnCantOfSistemsChangesOfAnySystemForId,
  returnBedsAndPatientsForRoomId,
  findSystemChangesOfInternmentWithInternmentId,
  deleteAssignedDoctors,
  findAcotedEvaluationsOfSystemChangeWithSystemChangeId,
  returnRomsOfAnSystemForId,
  findInternmentWithId,
  findOpenInternmentWithPatientId,
  returnSystems,
  removeSystemChange,
  findSystemOfUser,
  findSystemForEvolution,
  findSystemOfUserForId,
  findPatientByDNI,
  findPatientByID,
  findContactPersonByPatientID,
  findEvolutionByID,
  returnBedsOfAnyRoomForId,
  returnPatientForBed,
  insert,
  insertPatient,
  insertContactPerson,
  insertBedWithPatient,
  removeBed,
  update,
  remove,
  getPatientById,
  evolvePatient,
  returCountFreeBedsInSystemId,
  returInfinitBedsOfSystem,
  stillFreeBed,
  assignPatientToBed,
  createAssignedDoctor,
  createInternment,
  createSystemChange,
  unassingPatientToInternment,
  unassingPatientToBed,
  deleteInternment,
  patientHasCurrentHospitalization,
  findRoomsFromASystemtByID,
  lastEvolveByPatientID,
};

export default queries;
