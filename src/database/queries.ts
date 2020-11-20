import dbAPI from "./database";
import { User } from "../model/User";
import { System } from "../model/System";
import { Patient } from "../model/Patient";
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

//SYSTEMAS / SALAS / CAMAS / PACIENTES
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
  FROM ttps_db.systemChanges sc
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

const insert = async (query: string, values: object): Promise<boolean> => {
  try {
    const result = await dbAPI.insert(query, values);
    return true;
  } catch {
    return false;
  }
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
  returnCantOfSistemsChangesOfAnySystemForId,
  returnBedsAnDPatientsForRoomId,
  returnRomsOfAnSystemForId,
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
};

export default queries;
