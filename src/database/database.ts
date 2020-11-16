import mysql from 'mysql2';
import { PoolConnection } from 'mysql2/promise';

interface IConnectionData {
    host: string,
    user: string,
    password: string,
    database: string,
    port: number,
    connectionLimit?: number
}

let db: mysql.Pool;

function getConnectionDB() {
    return db;
}

function generateConnection(conData: IConnectionData) {
    if (db) {
        return db;
    }
    db = mysql.createPool({
        host: conData.host,
        user: conData.user,
        password: conData.password,
        database: conData.database,
        port: conData.port
    });
}

async function createTransaction() {
    const connection = await db.promise().getConnection();
    connection.beginTransaction();
    return connection;
}

async function start(trx?: any): Promise<PoolConnection> {
    trx = trx ? await trx.query('START TRANSACTION') : await createTransaction();
    return trx;
}

async function commit(trx: any): Promise<void> {
    await trx.query('COMMIT');
    await trx.release();
}

async function rollback(trx: any): Promise<void> {
    await trx.query('ROLLBACK');
}

async function rawQuery(query: string, params: any[], transaction?: PoolConnection): Promise<any> {
    const conn = transaction || db.promise()
    try {
        const [resp = null] = await conn.query(query, params);
        return resp;
    } catch (err) {
        console.warn(err.message);
        throw new Error(err.message + ', in query: ' + query)
    }
}
async function patch<T>(name: string, model: T, id: string, transaction: PoolConnection): Promise<number> {
    const query = `SELECT id FROM ${name} WHERE ${id} = ?`;
    const record: any = await singleOrDefault(query, [(model as any)[id]], transaction);
    if (record) {
        await update(name, id, { ...record, ...model }, transaction);
        return record.id;
    }
    throw new Error('Profile does not exist');
};

async function logic_remove(name: string, id: number, transaction: PoolConnection): Promise<number> {
    const query = `SELECT id FROM ${name} WHERE id = ?`;
    const [record = null] = await rawQuery(query, [id], transaction);
    if (!record) {
        throw new Error(`Record does not exist: ${name}: ${id}`)
    }

    const updateQuery = `UPDATE ${name} SET ? WHERE id = ?`;
    await rawQuery(updateQuery, [{ deleted_at: new Date() }, record.id], transaction);
    return record.id;
};

async function remove(name: string, col: string, value: string, transaction: PoolConnection): Promise<boolean> {
    const query = `DELETE FROM ${name} WHERE ${col} = ${value};`;
    try {
        const result: { affectedRows: number} = await rawQuery(query, [], transaction);
        console.log(result);
        return result.affectedRows === 0 ? false : true;
    }
    catch (err) {
        console.log('error tratando de eliminar de la base! ', err);
        return false;
    };
};

async function update<T>(name: string, id: string, model: { id: string, set: string }, transaction: PoolConnection): Promise<number> {
    // Object.keys(model).forEach(key => model[key] === undefined && delete model[key]);
    const updateQuery = `UPDATE ${name} SET ${model.set} WHERE ${id} = ${model.id}`;
    console.log('query', updateQuery);
    return (await rawQuery(updateQuery, [], transaction)).affectedRows;
};

function processInsert(query: any, params: any) {
    const k = Object.keys(params)
    const bindedParams = k.map(v => '?').join(',')
    const keys = `(${k.join(',')} ) values ( ${bindedParams} )`
    return `${query} ${keys}`
}

async function singleOrDefault<T>(query: string, params: any[], transaction?: PoolConnection): Promise<T | null> {
    const [row = null] = await rawQuery(query, params, transaction);
    return row;
}
async function insert(query: string, params: object, transaction: PoolConnection): Promise<any> {

    const conn = transaction || db.promise()
    const insertQry = processInsert(query.replace(/(\r\n|\n|\r)/gm, ""), params)
    const values = Object.values(params)

    try {
        const sql = conn.format(insertQry, values);
        const idInsert = conn.execute(insertQry, values);
        return idInsert;
    } catch (err) {
        console.warn(err.message);
        throw new Error(err.message)
    }
}

const dbAPI = {
    generateConnection,
    getConnectionDB,
    start,
    commit,
    singleOrDefault,
    rawQuery,
    rollback,
    insert,
    remove,
    update
}
export default dbAPI;
