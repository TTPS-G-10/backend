import dbAPI from "./database";
import { PoolConnection } from "mysql2/promise";
import { User } from "../model/User";
import { System } from "../model/System";
import { Bed } from "../model/Bed";
import { Room } from "../model/Room";
import { Patient } from "../model/Patient";
import { Evolution } from "../model/Evolution";

type FindUserByEmail = (
  email: string,
  transaction: PoolConnection
) => Promise<User | null>;

//tiene que existir una mejor manera de hacer esto
type FindSystemByEmail = (
  system: string,
  transaction: PoolConnection
) => Promise<string | null>;

const findUserByEmail: FindUserByEmail = async (
  email: string,
  transaction: PoolConnection
): Promise<User | null> => {
  const sql = `
    SELECT user.name, user.lastName, user.role
    FROM ttps_db.user user
    WHERE email = ?
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<User | null>(sql, [email], transaction);
};

const findSystemOfUser = (
  email: string,
  transaction: PoolConnection
): Promise<System | null> => {
  const sql = `
    SELECT sys.name , sys.id
    FROM ttps_db.user user
    INNER JOIN ttps_db.worksAt wa on user.id = wa.userId INNER JOIN ttps_db.system sys on wa.systemId = sys.id
    WHERE email = ?
    LIMIT 1;
    `;
  return dbAPI.singleOrDefault<System | null>(sql, [email], transaction);
};

//SYSTEMAS / SALAS / CAMAS / PACIENTES
const returnSystems = (transaction: PoolConnection) => {
  const sql = `
     SELECT count(case when bd.patientId is not null then 1 end) as ocupedBeds, 
count(bd.Id) as totalBeds, sys.name,sys.id
  FROM ttps_db.system sys 
  INNER JOIN ttps_db.room rm on  sys.id = rm.systemId 
  INNER JOIN ttps_db.bed bd on  rm.id = bd.roomId
  group by sys.id
 union(
SELECT  0  as ocupedBeds, 0 as totalBeds, sys.name,sys.id
  FROM ttps_db.system sys 
  WHERE (sys.id) not in

( SELECT sys.id
  FROM ttps_db.system sys 
  INNER JOIN ttps_db.room rm on  sys.id = rm.systemId 
  INNER JOIN ttps_db.bed bd on  rm.id = bd.roomId
)
) 
    `;
  return dbAPI.rawQuery(sql, [], transaction);
};

const returnRomsOfAnSystemForId = (id: Number, transaction: PoolConnection) => {
  const sql = `
  SELECT  rm.name ,rm.id
  FROM ttps_db.system sys 
  INNER JOIN ttps_db.room rm on  sys.id = rm.systemId 
  WHERE sys.id = ?
  ORDER BY rm.name asc
  `;
  return dbAPI.rawQuery(sql, [id], transaction);
};

const returnBedsOfAnyRoomForId = (id: Number, transaction: PoolConnection) => {
  const sql = `
    SELECT  bd.name , bd.id , bd.patientId
    FROM  ttps_db.room rm 
    INNER JOIN ttps_db.bed bd on  rm.id = bd.roomId
    WHERE rm.id = ?
    ORDER BY bd.name asc
    `;
  return dbAPI.rawQuery(sql, [id], transaction);
};

const returnPatientForBed = (idBed: number, transaction: PoolConnection) => {
  const sql = `
   SELECT pt.id,pt.name ,pt.lastName 
    FROM ttps_db.bed bd 
    INNER JOIN ttps_db.patient pt on  pt.id = bd.patientId
    WHERE bd.id = ? 
    LIMIT 1
    `;
  return dbAPI.singleOrDefault<Patient | null>(sql, [idBed], transaction);
};

const returnBedsAnDPatientsForRoomId = (
  id: number,
  transaction: PoolConnection
) => {
  const sql = `
    SELECT  pt.name as patientName,pt.lastName as patientLastName,pt.id as patientId, bd.name as bedName, bd.id as bedId
    FROM ttps_db.room rm 
    INNER JOIN ttps_db.bed bd on  bd.roomId = rm.id
    INNER JOIN ttps_db.patient pt on  pt.id = bd.patientId
    WHERE rm.id = ? 
    ORDER BY rm.name asc
    `;
  return dbAPI.rawQuery(sql, [id], transaction);
};

const queries = {
  findUserByEmail,
  returnBedsAnDPatientsForRoomId,
  returnRomsOfAnSystemForId,
  returnSystems,
  findSystemOfUser,
  returnBedsOfAnyRoomForId,
  returnPatientForBed,
};

export default queries;
