const dbAPI = require('./database');

const findUserByEmail = (email, transaction) => {
    const sql = `
    SELECT user.name, user.lastname, user.role
    FROM ttps_db.user user
    WHERE email = ?
    LIMIT 1;
    `
    return dbAPI.singleOrDefault(sql, [email], transaction);
}

const findSystemOfUser = (email, transaction) => {
    const sql = `
    SELECT sys.name as system_name
    FROM ttps_db.user user
    INNER JOIN ttps_db.works_at wa on user.id = wa.user_id INNER JOIN ttps_db.system sys on wa.system_id = sys.id
    WHERE email = ?
    LIMIT 1;
    `
    return dbAPI.singleOrDefault(sql, [email], transaction);
}

const returnPatientsOfAnSystemForName = (name, transaction) => {
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
    `
    return dbAPI.rawQuery(sql, [name], transaction);
}

const returnRomsOfAnSystemForName = (name, transaction) => {
    const sql = `
    SELECT  rm.name as room_name 
    FROM ttps_db.system sys 
    INNER JOIN ttps_db.have_a_place hp ON sys.id = hp.system_id 
    INNER JOIN ttps_db.room rm on  hp.room_id = rm.id 
    WHERE sys.name = ?
    GROUP BY rm.name ORDER BY rm.name asc
    `
    return dbAPI.rawQuery(sql, [name], transaction);
}

const returnSystemForAdmin = (transaction) => {
    const sql = `
    SELECT  sys.name as system_name , sys.id as system_id 
    FROM ttps_db.system sys 
    ORDER BY sys.name asc
    `
    return dbAPI.rawQuery(sql,transaction);
}
const returnRoomForAdmin = (transaction) => {
    const sql = `
    SELECT   sys.id as system_id,rm.name as room_name ,rm.id as room_id 
    FROM ttps_db.system sys 
    INNER JOIN ttps_db.have_a_place hp ON sys.id = hp.system_id 
    INNER JOIN ttps_db.room rm on  hp.room_id = rm.id
    ORDER BY sys.name,rm.name asc
    `
    return dbAPI.rawQuery(sql,transaction);
}
const returnBedForAdmin = (transaction) => {
    const sql = `
    SELECT  rm.id as room_id , bd.name as bed_name, bd.id as bed_id 
    FROM ttps_db.system sys 
    INNER JOIN ttps_db.have_a_place hp ON sys.id = hp.system_id 
    INNER JOIN ttps_db.room rm on  hp.room_id = rm.id 
    INNER JOIN ttps_db.belongs bs on  rm.id = bs.room_id 
    INNER JOIN ttps_db.bed bd on  bs.bed_id = bd.id
    ORDER BY sys.name,rm.name,bd.name asc
    `
    return dbAPI.rawQuery(sql,transaction);
}
module.exports = {
    findUserByEmail,
    returnPatientsOfAnSystemForName,
    returnRomsOfAnSystemForName,
    returnSystemForAdmin,
    findSystemOfUser,
    returnBedForAdmin,
    returnRoomForAdmin,

};