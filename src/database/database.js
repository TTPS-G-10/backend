const mysql = require('mysql2');

let db;

function getConnectionDB() {
    return db;
}

function generateConnection(conData) {
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

async function start(trx) {
    trx = trx ?  await trx.query('START TRANSACTION') : await createTransaction();
    return trx;
}

async function commit(trx) {
    await trx.query('COMMIT');
    await trx.release();
}

async function rollback(trx) {
    await trx.query('ROLLBACK');
}

async function rawQuery(query, params, transaction = null) {
    const conn = transaction || db.promise()
    try {

        const sql = conn.format(query, params);
        const [resp = null] = await conn.query(query, params);
        return resp;
    } catch (err) {
        console.warn(err.message);
        throw new Error(err.message + ', in query: ' + query)
    }
}
async function patch(name, model, id, transaction = null) {
    const query = `SELECT id FROM ${name} WHERE ${id} = ?`;
    const record = await singleOrDefault(query, [model[id]], transaction);
    if (record) {
        await update(name, id, { ...record, ...model }, transaction);
        return record.id;
    }
    throw new Error('Profile does not exist');
};

async function remove(name, id, transaction = null) {
    const query = `SELECT id FROM ${name} WHERE id = ?`;
    const [record = null] = await rawQuery(query, [id], transaction);
    if (!record) {
        throw new Error(`Record does not exist: ${name}: ${id}`)
    }

    const updateQuery = `UPDATE ${name} SET ? WHERE id = ?`;
    await rawQuery(updateQuery, [{ deleted_at: new Date() }, record.id], transaction);
    return record.id;
};

async function update(name, id, model, transaction = null) {
    Object.keys(model).forEach(key => model[key] === undefined && delete model[key]);
    const updateQuery = `UPDATE ${name} SET ? WHERE ${id} = ?`;
    return (await rawQuery(updateQuery, [{ ...model, updated_at: new Date() }, model[id]], transaction)).affectedRows;
};

function processInsert(query, params) {
    const k = Object.keys(params)
    const bindedParams = k.map(v => '?').join(',')
    const keys = `(${k.join(',')} ) values ( ${bindedParams} )`
    return `${query} ${keys}`
}

async function singleOrDefault(query, params, transaction) {
    const [row = null] = await rawQuery(query, params, transaction);
    return row;
}

module.exports = {
    generateConnection,
    getConnectionDB,
    start,
    commit,
    singleOrDefault,
    rawQuery,
    rollback
}
