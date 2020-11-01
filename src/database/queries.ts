import dbAPI from './database';
import { Doctor } from '../model/Doctor';
import { PoolConnection } from 'mysql2/promise';
import { System } from '../model/System';

const findUserByEmail = async (email: string, transaction: PoolConnection): Promise<Doctor | System | null> => {
    const sql = `
    SELECT user.name, user.lastname, user.role, sys.name as system_name
    FROM ttps_db.user user
    INNER JOIN ttps_db.directs_in di on user.directs_in_id = di.id INNER JOIN ttps_db.system sys on di.system_id = sys.id
    WHERE email = ?
    LIMIT 1;
    `
    return await dbAPI.singleOrDefault<Doctor | System>(sql, [email], transaction);
}

const queries = {
    findUserByEmail
};
export default queries;