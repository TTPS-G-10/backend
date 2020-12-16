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
import { RuleType, RuleOperator, KnownRulesKeys, Rule } from "../model/Rule";
import { Alert } from "../model/Alert";
const config = require("config");
const dbConfig = config.get("dbConfig");

type Cant = {
  cant: Number;
};

const findUserByEmail = async (email: string): Promise<User | null> => {
  console.log("email:", email);
  const sql = `
    SELECT *
    FROM ${dbConfig.database}.user user
    WHERE email = ? 
    LIMIT 1;
    `;
  console.log("Query para buscar el usuario", sql);
  return await dbAPI.singleOrDefault<User | null>(sql, [email]);
};
const findUserById = async (id: number): Promise<User | null> => {
  const sql = `
    SELECT *
    FROM ${dbConfig.database}.user user
    WHERE id = ?
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<User | null>(sql, [id]);
};

const findPatientByDNI = async (dni: number): Promise<Patient | null> => {
  const sql = `
    SELECT *
    FROM ${dbConfig.database}.patient
    WHERE dni =	?
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<Patient | null>(sql, [dni]);
};

const findPatientByID = async (id: number): Promise<Patient | null> => {
  const sql = `
    SELECT *
    FROM ${dbConfig.database}.patient
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
    FROM ${dbConfig.database}.contact_person
    WHERE patientID =	?
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<ContactPerson | null>(sql, [idPatient]);
};

const lastEvolveByPatientID = async (
  idPatient: number
): Promise<Evaluation | null> => {
  const sql = `SELECT *
                FROM ${dbConfig.database}.evaluation
                WHERE patientId=? AND id=(SELECT MAX(id)
                                          FROM ${dbConfig.database}.evaluation wHERE patientId=?
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
    FROM ${dbConfig.database}.system 
        INNER JOIN ${dbConfig.database}.room on  system.id = room.systemId 
        INNER JOIN ${dbConfig.database}.bed on  room.id = bed.roomId
        INNER JOIN ${dbConfig.database}.patient on  bed.patientId = patient.id
        WHERE patient.id = ?
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<Location | null>(sql, [idPatient]);
};

const findSystemOfUser = async (email: string): Promise<System | null> => {
  const sql = `
    SELECT sys.name , sys.id
    FROM ${dbConfig.database}.user user
    INNER JOIN ${dbConfig.database}.works_at wa on user.id = wa.userId
    INNER JOIN ${dbConfig.database}.system sys on wa.systemId = sys.id
    WHERE email = ?
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<System | null>(sql, [email]);
};
const findSystemForEvolution = async (id: number): Promise<String | null> => {
  const sql = `
    SELECT syst.name
    FROM ${dbConfig.database}.system as syst
    INNER JOIN ${dbConfig.database}.system_change as sc
    ON syst.id = sc.systemId
    WHERE sc.id=?
    LIMIT 1
    `;
  return await dbAPI.singleOrDefault<String | null>(sql, [id]);
};

const findSystemOfUserForId = async (id: number): Promise<System | null> => {
  const sql = `
    SELECT sys.name , sys.id
    FROM ${dbConfig.database}.works_at 
    INNER JOIN ${dbConfig.database}.system sys on works_at.systemId = sys.id
    WHERE works_at.userId = ?
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<System | null>(sql, [id]);
};

const findSystemChiefBySystemId = async (
  systemId: number
): Promise<User | null> => {
  const sql = `
    SELECT user.id,user.name,user.lastName,user.file,user.email
    FROM ${dbConfig.database}.user
    INNER JOIN ${dbConfig.database}.works_at on works_at.userId = user.id
    WHERE user.role = "JEFE DE SISTEMA" AND works_at.systemId = ?
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<User | null>(sql, [systemId]);
};

const findInternmentWithId = async (
  patientId: number
): Promise<Internment | null> => {
  const sql = `
 SELECT internment.*
    FROM ${dbConfig.database}.internment
    WHERE id = ?
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<Internment | null>(sql, [patientId]);
};

const findObitoInternmentWithPatientId = async (
  patientId: number
): Promise<Internment | null> => {
  const sql = `
 SELECT internment.*
    FROM ${dbConfig.database}.internment
    INNER JOIN ${dbConfig.database}.patient ON patient.id = internment.patientId
    WHERE (patient.id = ?)  AND  (internment.obitoDate IS NOT NULL)
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<Internment | null>(sql, [patientId]);
};

const findOpenInternmentWithPatientId = async (
  patientId: number
): Promise<Internment | null> => {
  const sql = `
 SELECT internment.*
    FROM ${dbConfig.database}.internment
    INNER JOIN ${dbConfig.database}.patient ON patient.id = internment.patientId
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
        FROM ${dbConfig.database}.system 
        WHERE system.name = ?
    LIMIT 1
    `;
  return await dbAPI.singleOrDefault<System | null>(sql, [systemName]);
};

const findSystemChangesOfInternmentWithInternmentId = async (
  internmentId: number
) => {
  const sql = `
  SELECT system_change.*,system.name as systemName
    FROM ${dbConfig.database}.system_change
    INNER JOIN ${dbConfig.database}.internment ON system_change.internmentId = internment.id
    INNER JOIN ${dbConfig.database}.system ON system_change.systemId = system.id
    WHERE (internment.id = ?)
    ORDER BY createtime desc
    `;
  return await dbAPI.rawQuery(sql, [internmentId]);
};

const returnPatientsAssinedToUserById = async (userId: number) => {
  const sql = `
  SELECT patient.name as patientName,internment.id as internmentId,patient.lastName as patientLastName,patient.id as patientId
    FROM ${dbConfig.database}.user
    INNER JOIN ${dbConfig.database}.assigned_doctor on assigned_doctor.userId = user.id
    INNER JOIN ${dbConfig.database}.internment on internment.id= assigned_doctor.internmentId
    INNER JOIN ${dbConfig.database}.patient on internment.patientId = patient.id
    WHERE user.id= ?
    `;
  return await dbAPI.rawQuery(sql, [userId]);
};

const returnDoctorsIdAssinedToInternmentById = async (internmentId: number) => {
  const sql = `
  SELECT  user.id
    FROM ${dbConfig.database}.user
    INNER JOIN ${dbConfig.database}.assigned_doctor on assigned_doctor.userId = user.id
    INNER JOIN ${dbConfig.database}.internment on internment.id= assigned_doctor.internmentId
    WHERE internment.id= ?
    `;
  return await dbAPI.rawQuery(sql, [internmentId]);
};

const findAcotedEvaluationsOfSystemChangeWithSystemChangeId = async (
  internmentId: number
) => {
  const sql = `
SELECT evaluation.id, evaluation.userId, evaluation.patientId, evaluation.systemChangeId, evaluation.createTime
    FROM ${dbConfig.database}.evaluation
    INNER JOIN ${dbConfig.database}.system_change ON system_change.Id = evaluation.systemChangeId
    WHERE (system_change.id = ?)
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
        FROM ${dbConfig.database}.system sys 
        INNER JOIN ${dbConfig.database}.room rm on  sys.id = rm.systemId 
        INNER JOIN ${dbConfig.database}.bed bd on  rm.id = bd.roomId
        WHERE  (sys.id = ?) AND (rm.id = ?) AND (bd.patientId is NULL)
        LIMIT 1
    `;
  return await dbAPI.singleOrDefault<Bed | null>(sql, [systemId, roomId]);
};

const returnBedsWithSpaceOfRoomForRoomId = async (id: Number) => {
  const sql = `
         SELECT bd.name,bd.id
        FROM ${dbConfig.database}.bed bd 
        WHERE (bd.roomId=?) AND (bd.patientId is NULL)
        GROUP BY bd.id
    `;
  const result = await dbAPI.rawQuery(sql, [id]);
  return result;
};

const returnSystems = async () => {
  const sql = `
      SELECT count(case when bd.patientId is not null then 1 end) as ocupedBeds, 
      count(bd.Id) as totalBeds, sys.name,sys.id,sys.infinitBeds
        FROM ${dbConfig.database}.system sys 
        INNER JOIN ${dbConfig.database}.room rm on  sys.id = rm.systemId 
        INNER JOIN ${dbConfig.database}.bed bd on  rm.id = bd.roomId
        group by sys.id
      union(
      SELECT  0  as ocupedBeds, 0 as totalBeds, sys.name,sys.id,sys.infinitBeds
        FROM ${dbConfig.database}.system sys 
        WHERE (sys.id) not in

      ( SELECT sys.id
        FROM ${dbConfig.database}.system sys 
        INNER JOIN ${dbConfig.database}.room rm on  sys.id = rm.systemId 
        INNER JOIN ${dbConfig.database}.bed bd on  rm.id = bd.roomId
      )
      ) 
    `;

  const result = await dbAPI.rawQuery(sql, []);
  return result;
};

const returnCantOfSistemsChangesOfAnySystemForId = async (id: Number) => {
  const sql = `
 SELECT count(case when sc.systemId is not null then 1 end) as cant
  FROM ${dbConfig.database}.system_change sc
   WHERE sc.systemId = ?
  `;
  return await dbAPI.singleOrDefault<Cant>(sql, [id]);
};

const returnRomsOfAnSystemForId = async (id: Number) => {
  const sql = `
  SELECT  rm.name ,rm.id
  FROM ${dbConfig.database}.system sys 
  INNER JOIN ${dbConfig.database}.room rm on  sys.id = rm.systemId 
  WHERE sys.id = ?
  ORDER BY rm.name asc
  `;
  return await dbAPI.rawQuery(sql, [id]);
};

const returnBedsOfAnyRoomForId = async (id: Number) => {
  const sql = `
    SELECT  bd.name , bd.id , bd.patientId
    FROM  ${dbConfig.database}.room rm 
    INNER JOIN ${dbConfig.database}.bed bd on  rm.id = bd.roomId
    WHERE rm.id = ?
    ORDER BY bd.name asc
    `;
  return await dbAPI.rawQuery(sql, [id]);
};

const returnPatientForBed = async (idBed: number) => {
  const sql = `
   SELECT pt.id,pt.name ,pt.lastName 
    FROM ${dbConfig.database}.bed bd 
    INNER JOIN ${dbConfig.database}.patient pt on  pt.id = bd.patientId
    WHERE bd.id = ? 
    LIMIT 1
    `;
  return await dbAPI.singleOrDefault<Patient | null>(sql, [idBed]);
};

const returnBedsAndPatientsForRoomId = async (id: number) => {
  const sql = `
    SELECT  pt.name as patientName,pt.lastName as patientLastName,pt.id as patientId, bd.name as bedName, bd.id as bedId
    FROM ${dbConfig.database}.room rm 
    INNER JOIN ${dbConfig.database}.bed bd on  bd.roomId = rm.id
    INNER JOIN ${dbConfig.database}.patient pt on  pt.id = bd.patientId
    WHERE rm.id = ? 
    ORDER BY rm.name asc
    `;
  return await dbAPI.rawQuery(sql, [id]);
};

const returCountFreeBedsInSystemId = async (id: number) => {
  try {
    const sql = `
    SELECT COUNT(*) as cantFree
    FROM ${dbConfig.database}.bed INNER JOIN ${dbConfig.database}.room ON bed.roomId=room.id
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
    FROM ${dbConfig.database}.system
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
        FROM ${dbConfig.database}.room rm 
        INNER JOIN ${dbConfig.database}.bed bd on rm.id = bd.roomId
        WHERE (rm.systemId=?) AND (bd.patientId is NULL)
        GROUP BY rm.id `;

  const result = await dbAPI.rawQuery(sql, [id]);
  return result;
};
const findRoomsFromASystemtByID = async (id: number) => {
  const sql = `
         SELECT rm.name,rm.id
  FROM  ${dbConfig.database}.room rm 
  WHERE (rm.systemId=?) 
  GROUP BY rm.id `;

  const result = await dbAPI.rawQuery(sql, [id]);
  return result;
};

const findEvolutionByID = async (id: number) => {
  const sql = `
         SELECT *
  FROM ${dbConfig.database}.evaluation 
  WHERE id=? `;

  const result = await dbAPI.singleOrDefault<Evaluation | null>(sql, [id]);
  return result;
};
const returnDoctorsOfSystemForId = async (id: number) => {
  const sql = `
         SELECT user.name,user.lastName,user.id,user.file
    FROM ${dbConfig.database}.user
    INNER JOIN ${dbConfig.database}.works_at ON user.id = works_at.userId
    WHERE works_at.systemId = ? AND user.role = "DOCTOR"
    ORDER BY user.lastName desc `;

  const result = await dbAPI.rawQuery(sql, [id]);
  return result;
};

const patientHasCurrentHospitalization = async (idPatient: number) => {
  const sql = `
  SELECT *
  FROM ${dbConfig.database}.internment
  WHERE egressDate IS NULL AND obitoDate IS NULL AND patientId=?`;

  const result = await dbAPI.rawQuery(sql, [idPatient]);
  return result;
};

// devuelve todas la internaciones
const patienInternmentsByPatientId = async (idPatient: number) => {
  const sql = `
  SELECT internment.id,internment.patientId,internment.dateOfHospitalization,internment.obitoDate,internment.egressDate
  FROM ${dbConfig.database}.internment
  WHERE  patientId=?
  ORDER BY internment.dateOfHospitalization desc
  `;

  const result = await dbAPI.rawQuery(sql, [idPatient]);
  return result;
};

const returnCurrentSystemIdOfTheInternment = async (
  internmentId: number
): Promise<number | null> => {
  const sql = `
  SELECT system_change.systemId
    FROM ${dbConfig.database}.system_change
    INNER JOIN ${dbConfig.database}.internment ON system_change.internmentId = internment.id
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
  FROM ${dbConfig.database}.bed
  INNER JOIN ${dbConfig.database}.room ON bed.roomId = room.Id
  WHERE (room.systemId = ?) AND (bed.id=?) AND (room.id=?)
 `;

  const result = await dbAPI.rawQuery(sql, [idSystem, idBed, idRoom]);
  return result;
};
const createSystemChange = async (internmentId: number, systemId: number) => {
  const sql = `
  INSERT INTO ${dbConfig.database}.system_change (internmentId, systemId)
  VALUES (?, ? )
 `;
  const result = await dbAPI.rawQuery(sql, [internmentId, systemId]);
  return result;
};

const createAssignedDoctor = async (internmentId: number, userId: number) => {
  const sql = `
  INSERT INTO ${dbConfig.database}.assigned_doctor (internmentId, userId)
  VALUES (?,?)
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
  INSERT INTO ${dbConfig.database}.internment (historyOfDisease, dateOfSymptoms, dateOfDiagnosis,dateOfHospitalization, patientId)
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
  const sql = `UPDATE ${dbConfig.database}.internment SET
                patientId = NULL
                WHERE id = ?`;
  const result = await dbAPI.rawQuery(sql, [idInternment]);
  return result;
};

const deleteInternment = async (idInternment: number) => {
  const sql = `DELETE FROM ${dbConfig.database}.internment
              WHERE id = ?`;
  const result = await dbAPI.rawQuery(sql, [idInternment]);
  return result;
};

const deleteAssignedDoctors = async (idInternment: number) => {
  const sql = `DELETE FROM ${dbConfig.database}.assigned_doctor
              WHERE internmentId = ?`;
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

const insertAndReturnID = async (
  query: string,
  values: object
): Promise<number> => (await dbAPI.insert(query, values)).insertId;

const assignPatientToBed = async (idPatient: number, idBed: number) => {
  const sql = `UPDATE ${dbConfig.database}.bed
              SET patientId = ?
              WHERE bed.id=? `;
  const result = await dbAPI.rawQuery(sql, [idPatient, idBed]);
  return result;
};

const unassingPatientToBed = async (idBed: number) => {
  const sql = `UPDATE ${dbConfig.database}.bed
               SET patientId = NULL
                WHERE id = ?`;
  const result = await dbAPI.rawQuery(sql, [idBed]);
  return result;
};
const insertBedWithPatient = async (
  name: string,
  roomId: number,
  patientId: number
) => {
  const sql = `INSERT INTO ${dbConfig.database}.bed (name,  roomId, patientId)
        VALUES (?, ?, ?)`;
  const result = await dbAPI.rawQuery(sql, [name, roomId, patientId]);
  return result;
};

const removeBed = async (idBed: number) => {
  const sql = `DELETE FROM ${dbConfig.database}.bed
              WHERE (id = ?)`;
  const result = await dbAPI.rawQuery(sql, [idBed]);
  return result;
};

const removeSystemChange = async (idSystemChange: number) => {
  const sql = `DELETE FROM ${dbConfig.database}.system_change
              WHERE (id = ?)`;
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
     FROM ${dbConfig.database}.bed bd 
     INNER JOIN ${dbConfig.database}.patient pt on  pt.id = bd.patientId
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
  evolution: Evolution,
  systemChangeId: number,
  userId: number,
  patientId: number,
  createTime: Date
): Promise<number> => {
  const sql = `INSERT INTO ${dbConfig.database}.evaluation`;

  const payload = {
    ...evolution,
    userId,
    patientId,
    systemChangeId,
    createTime,
  };
  return await insertAndReturnID(sql, payload);
};

const changeRoleOfUserToSystemChief = async (userId: number) => {
  const sql = `UPDATE ${dbConfig.database}.user
               SET role = "JEFE DE SISTEMA"
                WHERE id = ?`;
  const result = await dbAPI.rawQuery(sql, [userId]);
  return result;
};

const changePatientsOfUserToOtherUser = async (
  doctorId: number,
  systemChiefId: number
) => {
  const sql = `UPDATE ${dbConfig.database}.assigned_doctor
               SET userId = ?
                WHERE userId = ?`;
  const result = await dbAPI.rawQuery(sql, [doctorId, systemChiefId]);
  return result;
};

const changeRoleOfUserToDoctor = async (userId: number) => {
  const sql = `UPDATE ${dbConfig.database}.user
               SET role ="DOCTOR"
                WHERE id = ?`;
  const result = await dbAPI.rawQuery(sql, [userId]);
  return result;
};

const saveAlerts = async (alerts: Alert[]): Promise<boolean[]> => {
  console.log("estructura de las alertas", alerts);

  const sql = `INSERT INTO ${dbConfig.database}.alert`;
  return await Promise.all(alerts.map((aux) => insert(sql, aux)));
};

const getAlertsByUserId = async (id: number) => {
  const sql = `SELECT * FROM ${dbConfig.database}.alert WHERE alert.userId = ? ORDER BY alert.date desc `;
  return await dbAPI.rawQuery(sql, [id]);
};

const getAlertsAndPatientByUserId = async (id: number) => {
  const sql = `SELECT alert.message,alert.readByUser,alert.id as alertId,evaluation.id as evaluationId,system_change.internmentId as internmentId,alert.date,patient.name,patient.lastName
  FROM  ${dbConfig.database}.alert 
  INNER JOIN  ${dbConfig.database}.evaluation  on  evaluation.id = alert.evaluationId
  INNER JOIN  ${dbConfig.database}.patient  on  patient.id = evaluation.patientId
  INNER JOIN  ${dbConfig.database}.system_change on  system_change.id = evaluation.systemChangeId
  WHERE alert.userId = ?
  ORDER BY alert.date desc `;
  return await dbAPI.rawQuery(sql, [id]);
};

const getAlertsnotSeeByUserId = async (id: number) => {
  const sql = `SELECT * FROM ${dbConfig.database}.alert WHERE alert.readByUser = false AND alert.userId = ? ORDER BY alert.date desc`;
  return await dbAPI.rawQuery(sql, [id]);
};

const updateStateRule = async (id: number, value: boolean) => {
  const sql = `UPDATE ${dbConfig.database}.rules SET
                active = ?
                WHERE id = ?`;
  const result = await dbAPI.singleOrDefault(sql, [value, id]);
  return result;
};
const getAllRules = async () => {
  const sql = `SELECT * FROM ${dbConfig.database}.rules `;
  return await dbAPI.rawQuery(sql, []);
};

const getRules = async (): Promise<Rule[]> => {
  const sql = `
    SELECT *
    FROM ${dbConfig.database}.rules rules
    LIMIT 100;
  `;
  const result = await dbAPI.rawQuery(sql, []);
  console.log("database rules =>", result);
  return result;
};

const getPreviousEvolution = async (
  patientId: number
): Promise<Evolution | null> => {
  const sql = `SELECT * FROM ${dbConfig.database}.evaluation ORDER BY evaluation.createTime desc LIMIT 1;`;
  return await dbAPI.singleOrDefault<Evolution>(sql, []);
};

const setAlertAsSeen = async (alertID: number): Promise<boolean> => {
  const sql = `UPDATE ${dbConfig.database}.alert
  SET readByUser = 1
   WHERE id = ?`;
  return dbAPI.rawQuery(sql, [alertID]);
};

const setObitoOfInternment = async (fecha: Date, internmentId: number) => {
  const sql = `UPDATE ${dbConfig.database}.internment
               SET obitoDate = ?
                WHERE id = ?`;
  const result = await dbAPI.rawQuery(sql, [fecha, internmentId]);
  return result;
};

const setEgressOfInternment = async (fecha: Date, internmentId: number) => {
  const sql = `UPDATE ${dbConfig.database}.internment
               SET egressDate = ?
                WHERE id = ?`;
  const result = await dbAPI.rawQuery(sql, [fecha, internmentId]);
  return result;
};

// queries.insert('INSERT INTO bed', { name: 'cama 222', logicDelet: null, roomId: 1, patientId: null }).then((ok) => console.log('insertó bien?', ok));
// queries.update('bed', 'id', { set: "name = 'cama_modificada_1'", id: 1 }).then((ok) => console.log('modificó bien?', ok));
// queries.remove('bed', 'id', '2').then((ok) => console.log('borró bien?', ok));

const queries = {
  getAlertsnotSeeByUserId,
  getAlertsAndPatientByUserId,
  changePatientsOfUserToOtherUser,
  patienInternmentsByPatientId,
  findObitoInternmentWithPatientId,
  setObitoOfInternment,
  setEgressOfInternment,
  returnDoctorsIdAssinedToInternmentById,
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
  getRules,
  saveAlerts,
  getAlertsByUserId,
  getPreviousEvolution,
  setAlertAsSeen,
  lastEvolveByPatientID,
  getAllRules,
  updateStateRule,
};

export default queries;
