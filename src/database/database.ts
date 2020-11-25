import mysql from 'mysql2/promise';
import { PoolConnection } from 'mysql2/promise';
import bluebird from 'bluebird';

interface IConnectionData {
    host: string,
    user: string,
    password: string,
    database: string,
    port: number,
    connectionLimit?: number,
    Promise?: any
}

let TTPS_DB_POOL: mysql.Pool;
let conData: IConnectionData;

async function generateConnection(_conData: IConnectionData) {
    if (TTPS_DB_POOL) {
        return;
    }
    conData = { ..._conData, Promise: bluebird };
    TTPS_DB_POOL = mysql.createPool(conData);
}

async function createTransaction() {
    const connection = await TTPS_DB_POOL.getConnection();
    await connection.beginTransaction();
    return connection;
}

async function start(): Promise<PoolConnection> {
    const trx = await createTransaction();
    return trx;
}

async function rawQuery(query: string, params: any[]): Promise<any> {
    // const connection = await start();
    const connection = await mysql.createConnection(conData);
    
    try {
        const [resp = null] = await connection.execute(query, params);
        await connection.commit();
        await connection.end();
        return resp;
    } catch (err) {
        await connection.rollback();
        console.warn(err.message);
        throw new Error(err.message + ', in query: ' + query);
    }
}

async function insert(query: string, params: object): Promise<any> {

    const connection = await mysql.createConnection(conData);
    const insertQry = processInsert(query.replace(/(\r\n|\n|\r)/gm, ""), params)
    const values = Object.values(params);

    try {
        const sql = connection.format(insertQry, values);
        const idInsert = await connection.execute(sql, values);
        await connection.commit();
        await connection.end();
        return idInsert;
    } catch (err) {
        await connection.rollback();
        console.warn(err.message);
        throw new Error(err.message);
    }
}

async function remove(name: string, col: string, value: string, transaction: PoolConnection): Promise<boolean> {
    const query = `DELETE FROM ${name} WHERE ${col} = ${value};`;
    try {
        const result: { affectedRows: number } = await rawQuery(query, []);
        console.log(result);
        return result.affectedRows === 0 ? false : true;
    }
    catch (err) {
        console.log('error tratando de eliminar de la base! ', err);
        return false;
    };
};

async function update<T>(name: string, id: string, model: { id: string, set: string }): Promise<number> {
    // Object.keys(model).forEach(key => model[key] === undefined && delete model[key]);
    const updateQuery = `UPDATE ${name} SET ${model.set} WHERE ${id} = ${model.id}`;
    console.log('query', updateQuery);
    const result = (await rawQuery(updateQuery, [])).affectedRows;
    return result;
};

function processInsert(query: any, params: any) {
    const k = Object.keys(params)
    const bindedParams = k.map(v => '?').join(',')
    const keys = `(${k.join(',')} ) values ( ${bindedParams} )`
    return `${query} ${keys}`
}

async function singleOrDefault<T>(query: string, params: any[]): Promise<T | null> {
    const [row = null] = await rawQuery(query, params);
    return row;
}

const dbAPI = {
    generateConnection,
    start,
    singleOrDefault,
    rawQuery,
    insert,
    remove,
    update
}
export default dbAPI;
