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
    SELECT user.name, user.lastname, user.role
    FROM ttps_db.user user
    WHERE email = ?
    LIMIT 1;
    `;
  return await dbAPI.singleOrDefault<User | null>(sql, [email], transaction);
};

const findSystemOfUser= (
  email: string,
  transaction: PoolConnection
): Promise<System | null> => {
  const sql = `
    SELECT sys.name
    FROM ttps_db.user user
    INNER JOIN ttps_db.works_at wa on user.id = wa.user_id INNER JOIN ttps_db.system sys on wa.system_id = sys.id
    WHERE email = ?
    LIMIT 1;
    `;
  return dbAPI.singleOrDefault< System | null>(sql, [email], transaction);
};

const returnPatientsForRoom = (id: number, transaction: PoolConnection ) => {
    const sql = `
    SELECT  rm.id as room_id , pt.name as patient_name,pt.last_name as patient_last_name,pt.id as patient_id, bd.name as bed_name, bd.id as bed_id
    FROM ttps_db.room rm 
    INNER JOIN have_a_place hp on hp.room_id = rm.id 
    INNER JOIN ttps_db.belongs bs on  rm.id = bs.room_id 
    INNER JOIN ttps_db.bed bd on  bs.bed_id = bd.id
    INNER JOIN ttps_db.system_changes sc on  sc.bed_id = bd.id 
    INNER JOIN ttps_db.internment it on  it.id = sc.internment_id 
    INNER JOIN ttps_db.patient_admission pa on  it.id = pa.internment_id 
    INNER JOIN ttps_db.patient pt on  pt.id = pa.patient_id
    WHERE rm.id = ? AND sc.finish = FALSE
    ORDER BY rm.name asc
    `;
  return dbAPI.rawQuery(sql, [id], transaction);
};

const returnRomsOfAnSystemForName = (name:string, transaction: PoolConnection ) => {
    const sql = `
    SELECT  rm.name ,rm.id
    FROM ttps_db.system sys 
    INNER JOIN ttps_db.have_a_place hp ON sys.id = hp.system_id 
    INNER JOIN ttps_db.room rm on  hp.room_id = rm.id 
    WHERE sys.name = ?
    ORDER BY rm.name asc
    `
    return dbAPI.rawQuery(sql, [name], transaction);
}
const returnRomsOfAnSystemForId = (id:Number, transaction: PoolConnection ) => {
  const sql = `
  SELECT  rm.name ,rm.id
  FROM ttps_db.system sys 
  INNER JOIN ttps_db.have_a_place hp ON sys.id = hp.system_id 
  INNER JOIN ttps_db.room rm on  hp.room_id = rm.id 
  WHERE sys.id = ?
  ORDER BY rm.name asc
  `
  return dbAPI.rawQuery(sql, [id], transaction);
}

const returnSystems = (transaction: PoolConnection) => {
  const sql = `
    SELECT  sys.name, sys.id 
    FROM ttps_db.system sys 
    ORDER BY sys.name asc
    `;
  return dbAPI.rawQuery(sql, [], transaction);
};



const returnBedsOfAnyRoomForId = (id:Number,transaction: PoolConnection) => {
  const sql = `
    SELECT  bd.name , bd.id 
    FROM  ttps_db.room rm 
    INNER JOIN ttps_db.belongs bs on  rm.id = bs.room_id 
    INNER JOIN ttps_db.bed bd on  bs.bed_id = bd.id
    WHERE rm.id = ?
    ORDER BY bd.name asc
    `;
  return dbAPI.rawQuery(sql, [id], transaction);
};


const returnBedsWithoutPatientsOfAnyRoomForId = (id:Number,transaction: PoolConnection) => {
  const sql = `
    SELECT  bd.name , bd.id 
        FROM ttps_db.room rm 
        INNER JOIN ttps_db.belongs bs on  rm.id = bs.room_id 
        INNER JOIN ttps_db.bed bd on  bs.bed_id = bd.id
        WHERE rm.id = ? AND
	(  bd.name,bd.id
	) NOT IN(
        SELECT  bd.name, bd.id
        FROM ttps_db.room rm 
        INNER JOIN ttps_db.belongs bs on  rm.id = bs.room_id 
        INNER JOIN ttps_db.bed bd on  bs.bed_id = bd.id
        INNER JOIN ttps_db.system_changes sc on  sc.bed_id = bd.id 
        INNER JOIN ttps_db.internment it on  it.id = sc.internment_id 
        INNER JOIN ttps_db.patient_admission pa on  it.id = pa.internment_id 
        INNER JOIN ttps_db.patient pt on  pt.id = pa.patient_id
        WHERE rm.id = ? AND sc.finish = FALSE )
        `
        return dbAPI.rawQuery(sql,[id,id],transaction);
    }
const queries = {
    findUserByEmail,
    returnPatientsForRoom,
    returnRomsOfAnSystemForName,
    returnRomsOfAnSystemForId,
    returnSystems,
    findSystemOfUser,
    returnBedsWithoutPatientsOfAnyRoomForId,
    returnBedsOfAnyRoomForId
};

export default queries;
