import mysql from "mysql2/promise";
import { PoolConnection, ResultSetHeader } from "mysql2/promise";

interface IConnectionData {
  host: string;
  user: string;
  password: string;
  database: string;
  port: number;
  connectionLimit?: number;
}

let db: mysql.Pool;
let TTPS_DB_POOL: PoolConnection;
let connection: mysql.Connection;
let CON_DATA: IConnectionData;

function getConnectionDB() {
  return db;
}

async function generateConnection(conData: IConnectionData) {
  CON_DATA = conData;
  if (db) {
    return db;
  }
  db = mysql.createPool({
    ...conData,
    waitForConnections: true,
    connectTimeout: 30000,
  });
  TTPS_DB_POOL = await db.getConnection();
  // connection = await mysql.createConnection(CON_DATA);
  return db;
}

async function createTransaction() {
  const connection = await db.getConnection();
  await connection.beginTransaction();
  return connection;
}

async function start(): Promise<PoolConnection> {
  const trx = await createTransaction();
  return trx;
}

async function commit(trx: PoolConnection): Promise<void> {
  try {
    await trx.commit();
  } catch {
    trx.rollback();
  }
}

async function rollback(trx: any): Promise<void> {
  await trx.query("ROLLBACK");
}

async function rawQuery(query: string, params: any[]): Promise<any> {
  await TTPS_DB_POOL.beginTransaction();
  //const connection = await mysql.createConnection(CON_DATA);
  //connection.beginTransaction();
  try {
    // const [resp = null] = await connection.execute(query, params);
    const [resp = null] = await TTPS_DB_POOL.execute(query, params);
    // await connection.commit();
    await TTPS_DB_POOL.commit();
    return resp;
  } catch (err) {
    // await connection.rollback();
    // await connection.commit();
    await TTPS_DB_POOL.rollback();
    await TTPS_DB_POOL.commit();
    console.warn(err.message);
    throw new Error(err.message + ", in query: " + query);
  } finally {
    console.log("end connection");
    //connection.end();
    TTPS_DB_POOL.release();
  }
}

async function insert(query: string, params: object): Promise<any> {
  // await TTPS_DB_POOL.beginTransaction();
  const connection = await mysql.createConnection(CON_DATA);
  connection.beginTransaction();
  const insertQry = processInsert(query.replace(/(\r\n|\n|\r)/gm, ""), params);
  const values = Object.values(params);

  try {
    const sql = connection.format(insertQry, values);
    const result = (await connection.execute<ResultSetHeader>(
      sql,
      values
    )) as ResultSetHeader[];
    await connection.commit();
    return result[0];
  } catch (err) {
    await connection.rollback();
    await connection.commit();
    console.warn(err.message);
    throw new Error(err.message);
  } finally {
    console.log("close db connection");
    connection.end();
  }
}

async function remove(
  name: string,
  col: string,
  value: string,
  transaction: PoolConnection
): Promise<boolean> {
  const query = `DELETE FROM ${name} WHERE ${col} = ${value};`;
  try {
    const result: { affectedRows: number } = await rawQuery(query, []);
    console.log(result);
    return result.affectedRows === 0 ? false : true;
  } catch (err) {
    console.log("error tratando de eliminar de la base! ", err);
    return false;
  }
}

async function update<T>(
  name: string,
  id: string,
  model: { id: string; set: string }
): Promise<number> {
  // Object.keys(model).forEach(key => model[key] === undefined && delete model[key]);
  const updateQuery = `UPDATE ${name} SET ${model.set} WHERE ${id} = ${model.id}`;
  console.log("query", updateQuery);
  const result = (await rawQuery(updateQuery, [])).affectedRows;
  return result;
}

function processInsert(query: any, params: any) {
  const k = Object.keys(params);
  const bindedParams = k.map((v) => "?").join(",");
  const keys = `(${k.join(",")} ) values ( ${bindedParams} )`;
  return `${query} ${keys}`;
}

async function singleOrDefault<T>(
  query: string,
  params: any[]
): Promise<T | null> {
  const [row = null] = await rawQuery(query, params);
  return row;
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
  update,
};
export default dbAPI;
