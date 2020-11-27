import dbAPI from "./database";
import { User } from "../model/User";
import { System } from "../model/System";
import { Internment } from "../model/Internment";
import { Patient } from "../model/Patient";
import { Location } from "../model/Location";
import { ContactPerson } from "../model/ContactPerson";

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

const LocationOfPatientWhitPatientId = async (
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

const findAcotedEvaluationsOfSystemChangeWhitSystemChangeId = async (
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

const returnSystemsWithSpace = async () => {
  const sql = `
       SELECT sys.name,sys.id,sys.infinitBeds
        FROM ttps_db.system sys 
        INNER JOIN ttps_db.room rm on  sys.id = rm.systemId 
        INNER JOIN ttps_db.bed bd on  rm.id = bd.roomId
        WHERE (bd.patientId is NULL) OR (sys.infinitBeds = true)
        GROUP BY sys.id
     
    `;
  const result = await dbAPI.rawQuery(sql, []);
  return result;
};

const returnRoomsWithSpaceOfSystemForSystemId = async (id: Number) => {
  const sql = `
       SELECT rm.name,rm.id
        FROM  ttps_db.room rm 
        INNER JOIN ttps_db.bed bd on  rm.id = bd.roomId
        WHERE (rm.systemId=?) AND (bd.patientId is NULL)
        GROUP BY rm.id
    `;
  const result = await dbAPI.rawQuery(sql, [id]);
  return result;
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

const returnBedsAnDPatientsForRoomId = async (id: number) => {
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
const returnRoomsWhitSpaceOfSystemForSystemId = async (id: Number) => {
  const sql = `
       SELECT rm.name,rm.id
        FROM  JOIN ttps_db.room rm 
        INNER JOIN ttps_db.bed bd on  rm.id = bd.roomId
        WHERE (rm.systemId=?) AND (bd.patientId is NULL)
        GROUP BY rm.id `;
  const result = await dbAPI.rawQuery(sql, [id]);
  return result;
};

const returnBedsWhitSpaceOfRoomForRoomId = async (id: Number) => {
  const sql = `
         SELECT bd.name,bd.id
        FROM ttps_db.bed bd 
        WHERE (bd.roomId='?') AND (bd.patientId is NULL)
        GROUP BY bd.id `;

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
  INSERT INTO systemChanges (internmentId, systemId)
  VALUES (?, ? )
 `;
  const result = await dbAPI.rawQuery(sql, [internmentId, systemId]);
  return result;
};
const createInternment = async (
  historyOfDisease: string,
  dateOfSymptoms: Date,
  dateOfDiagnosis: Date,
  idPatientN: number
) => {
  const sql = `
  INSERT INTO internment (historyOfDisease, dateOfSymptoms, dateOfDiagnosis, patientId)
  VALUES (?, ?, ?, ?)
 `;

  const result = await dbAPI.rawQuery(sql, [
    historyOfDisease,
    dateOfSymptoms,
    dateOfDiagnosis,
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

const insert = async (query: string, values: object): Promise<boolean> => {
  try {
    const result = await dbAPI.insert(query, values);
    return true;
  } catch {
    return false;
  }
};

const assignPatientToBed = async (
  idPatient: number,
  idBed: number,
  idRoom: number
) => {
  const sql = `UPDATE bed
              SET  patientId = '?'
              WHERE bed.id='?' AND roomId = '?'`;
  const result = await dbAPI.rawQuery(sql, [idPatient, idBed, idRoom]);
  return result;
};

const unassingPatientToBed = async (idBed: number) => {
  const sql = `UPDATE patient SET
                patientId = NULL
                WHERE id = '?'`;
  const result = await dbAPI.rawQuery(sql, [idBed]);
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

// queries.insert('INSERT INTO bed', { name: 'cama 222', logicDelet: null, roomId: 1, patientId: null }).then((ok) => console.log('insertó bien?', ok));
// queries.update('bed', 'id', { set: "name = 'cama_modificada_1'", id: 1 }).then((ok) => console.log('modificó bien?', ok));
// queries.remove('bed', 'id', '2').then((ok) => console.log('borró bien?', ok));

const queries = {
  findUserByEmail,
  returnSystemsWithSpace,
  returnBedsWithSpaceOfRoomForRoomId,
  returnRoomsWithSpaceOfSystemForSystemId,
  LocationOfPatientWhitPatientId,
  returnCantOfSistemsChangesOfAnySystemForId,
  returnBedsAnDPatientsForRoomId,
  findSystemChangesOfInternmentWithInternmentId,
  findAcotedEvaluationsOfSystemChangeWhitSystemChangeId,
  returnRomsOfAnSystemForId,
  findOpenInternmentWithPatientId,
  returnSystems,
  findSystemOfUser,
  findPatientByDNI,
  findPatientByID,
  findContactPersonByPatientID,
  returnBedsOfAnyRoomForId,
  returnPatientForBed,
  insert,
  insertPatient,
  insertContactPerson,
  update,
  remove,
  returCountFreeBedsInSystemId,
  returInfinitBedsOfSystem,
  returnRoomsWhitSpaceOfSystemForSystemId,
  returnBedsWhitSpaceOfRoomForRoomId,
  stillFreeBed,
  assignPatientToBed,
  createInternment,
  createSystemChange,
  unassingPatientToInternment,
  unassingPatientToBed,
  deleteInternment,
  patientHasCurrentHospitalization,
};

export default queries;
