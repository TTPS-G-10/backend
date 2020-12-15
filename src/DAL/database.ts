import mysql from "mysql2";
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

function getConnectionDB() {
  return db;
}

async function generateConnection(conData: IConnectionData) {
  if (db) {
    return db;
  }
  db = mysql.createPool({
    host: conData.host,
    user: conData.user,
    password: conData.password,
    database: conData.database,
    port: conData.port,
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 30000,
    queueLimit: 0,
  });
  TTPS_DB_POOL = await db.promise().getConnection();
  return db;
}

async function createTransaction() {
  const connection = await db.promise().getConnection();
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
  try {
    const [resp = null] = await TTPS_DB_POOL.query(query, params);
    await TTPS_DB_POOL.commit();
    TTPS_DB_POOL.release();
    return resp;
  } catch (err) {
    await TTPS_DB_POOL.rollback();
    console.warn(err.message);
    throw new Error(err.message + ", in query: " + query);
  }
}

async function insert(query: string, params: object): Promise<any> {
  await TTPS_DB_POOL.beginTransaction();
  const insertQry = processInsert(query.replace(/(\r\n|\n|\r)/gm, ""), params);
  const values = Object.values(params);

  try {
    const sql = TTPS_DB_POOL.format(insertQry, values);
    const result = (await TTPS_DB_POOL.query<ResultSetHeader>(
      sql,
      values
    )) as ResultSetHeader[];
    await TTPS_DB_POOL.commit();
    TTPS_DB_POOL.release();
    return result[0];
  } catch (err) {
    await TTPS_DB_POOL.rollback();
    console.warn(err.message);
    throw new Error(err.message);
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
