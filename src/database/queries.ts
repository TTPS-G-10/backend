import dbAPI from "./database";
import { PoolConnection } from "mysql2/promise";
import { User } from "../model/User";

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

const findSystemOfUser: FindSystemByEmail = (
  email: string,
  transaction: PoolConnection
): Promise<string | null> => {
  const sql = `
    SELECT sys.name as system_name
    FROM ttps_db.user user
    INNER JOIN ttps_db.works_at wa on user.id = wa.user_id INNER JOIN ttps_db.system sys on wa.system_id = sys.id
    WHERE email = ?
    LIMIT 1;
    `;
  return dbAPI.singleOrDefault<string | null>(sql, [email], transaction);
};

const returnPatientsOfAnSystemForName = (
  name: string,
  transaction: PoolConnection
) => {
  const sql = `
    SELECT  rm.name as room_name , pt.name as patient_name,pt.last_name as patient_last_name,pt.id as patient_id, bd.name as bed_name
    FROM ttps_db.system sys 
    INNER JOIN ttps_db.have_a_place hp ON sys.id = hp.system_id 
    INNER JOIN ttps_db.room rm on  hp.room_id = rm.id 
    INNER JOIN ttps_db.belongs bs on  rm.id = bs.room_id 
    INNER JOIN ttps_db.bed bd on  bs.bed_id = bd.id
    INNER JOIN ttps_db.system_changes sc on  sc.bed_id = bd.id 
    INNER JOIN ttps_db.internment it on  it.id = sc.internment_id 
    INNER JOIN ttps_db.patient_admission pa on  it.id = pa.internment_id 
    INNER JOIN ttps_db.patient pt on  pt.id = pa.patient_id
    WHERE sys.name = ? AND sc.finish = FALSE
    ORDER BY rm.name asc
    `;
  return dbAPI.rawQuery(sql, [name], transaction);
};

const returnRomsOfAnSystemForName = (
  name: string,
  transaction: PoolConnection
) => {
  const sql = `
    SELECT  rm.name as room_name 
    FROM ttps_db.system sys 
    INNER JOIN ttps_db.have_a_place hp ON sys.id = hp.system_id 
    INNER JOIN ttps_db.room rm on  hp.room_id = rm.id 
    WHERE sys.name = ?
    GROUP BY rm.name ORDER BY rm.name asc
    `;
  return dbAPI.rawQuery(sql, [name], transaction);
};

const returnSystems = (transaction: PoolConnection) => {
  const sql = `
    SELECT  sys.name as system_name , sys.id as system_id 
    FROM ttps_db.system sys 
    ORDER BY sys.name asc
    `;
  return dbAPI.rawQuery(sql, [], transaction);
};
const returnRooms = (transaction: PoolConnection) => {
  const sql = `
    SELECT   sys.id as system_id,rm.name as room_name ,rm.id as room_id 
    FROM ttps_db.system sys 
    INNER JOIN ttps_db.have_a_place hp ON sys.id = hp.system_id 
    INNER JOIN ttps_db.room rm on  hp.room_id = rm.id
    ORDER BY sys.name,rm.name asc
    `;
  return dbAPI.rawQuery(sql, [], transaction);
};
const returnBeds = (transaction: PoolConnection) => {
  const sql = `
    SELECT  rm.id as room_id , bd.name as bed_name, bd.id as bed_id 
    FROM ttps_db.system sys 
    INNER JOIN ttps_db.have_a_place hp ON sys.id = hp.system_id 
    INNER JOIN ttps_db.room rm on  hp.room_id = rm.id 
    INNER JOIN ttps_db.belongs bs on  rm.id = bs.room_id 
    INNER JOIN ttps_db.bed bd on  bs.bed_id = bd.id
    ORDER BY sys.name,rm.name,bd.name asc
    `;
  return dbAPI.rawQuery(sql, [], transaction);
};

const returnBedsAndPatiens = (transaction: PoolConnection) => {
  const sql = `
        SELECT  pt.name as patient_name,pt.last_name as patient_last_name,pt.id as patient_id, bd.name as bed_name, bd.id as bed_id, rm.id as room_id
        FROM ttps_db.system sys 
        INNER JOIN ttps_db.have_a_place hp ON sys.id = hp.system_id 
        INNER JOIN ttps_db.room rm on  hp.room_id = rm.id 
        INNER JOIN ttps_db.belongs bs on  rm.id = bs.room_id 
        INNER JOIN ttps_db.bed bd on  bs.bed_id = bd.id
        INNER JOIN ttps_db.system_changes sc on  sc.bed_id = bd.id 
        INNER JOIN ttps_db.internment it on  it.id = sc.internment_id 
        INNER JOIN ttps_db.patient_admission pa on  it.id = pa.internment_id 
        INNER JOIN ttps_db.patient pt on  pt.id = pa.patient_id
        WHERE sc.finish = FALSE
        ORDER BY rm.name,bed_name asc
        `;
  return dbAPI.rawQuery(sql, [], transaction);
};
const returnBedsWithoutPatients = (transaction: PoolConnection) => {
  const sql = `
    SELECT  bd.name as bed_name, bd.id as bed_id, rm.id as room_id
        FROM ttps_db.system sys 
        INNER JOIN ttps_db.have_a_place hp ON sys.id = hp.system_id 
        INNER JOIN ttps_db.room rm on  hp.room_id = rm.id 
        INNER JOIN ttps_db.belongs bs on  rm.id = bs.room_id 
        INNER JOIN ttps_db.bed bd on  bs.bed_id = bd.id
        WHERE
	(  bd.name,
           bd.id,
           rm.id
	) NOT IN(

        SELECT  bd.name, bd.id, rm.id
        FROM ttps_db.system sys 
        INNER JOIN ttps_db.have_a_place hp ON sys.id = hp.system_id 
        INNER JOIN ttps_db.room rm on  hp.room_id = rm.id 
        INNER JOIN ttps_db.belongs bs on  rm.id = bs.room_id 
        INNER JOIN ttps_db.bed bd on  bs.bed_id = bd.id
        INNER JOIN ttps_db.system_changes sc on  sc.bed_id = bd.id 
        INNER JOIN ttps_db.internment it on  it.id = sc.internment_id 
        INNER JOIN ttps_db.patient_admission pa on  it.id = pa.internment_id 
        INNER JOIN ttps_db.patient pt on  pt.id = pa.patient_id
        WHERE sc.finish = FALSE )
        `;
  return dbAPI.rawQuery(sql, [], transaction);
};

const queries: {
  findUserByEmail: FindUserByEmail;
  findSystemOfUser: FindSystemByEmail;
} = {
  findUserByEmail,
  findSystemOfUser,
};
export default queries;
