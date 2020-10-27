const dbAPI = require('./database');
const findUserByEmail = (email, transaction) => {
    const sql = `
    SELECT user.name, user.lastname, user.role, sys.name as system_name
    FROM ttps_db.user user
    INNER JOIN ttps_db.directs_in di on user.directs_in_id = di.id INNER JOIN ttps_db.system sys on di.system_id = sys.id
    WHERE email = ?
    LIMIT 1;
    `
    return dbAPI.singleOrDefault(sql, [email], transaction);
}

module.exports = {
    findUserByEmail
};