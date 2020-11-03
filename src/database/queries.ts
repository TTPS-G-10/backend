import dbAPI from './database';
import { PoolConnection } from 'mysql2/promise';
import { System } from '../model/System';
import { User } from '../model/User';

const findUserByEmail = async (email: string, transaction: PoolConnection): Promise<User | System | null> => {
    const sql = `
    SELECT user.name, user.lastname, user.role, sys.name as system_name
    FROM ttps_db.user user
    INNER JOIN ttps_db.directs_in di on user.directs_in_id = di.id INNER JOIN ttps_db.system sys on di.system_id = sys.id
    WHERE email = ?
    LIMIT 1;
    `
    return await dbAPI.singleOrDefault<User | System>(sql, [email], transaction);
}

const queries = {
    findUserByEmail
};
export default queries;