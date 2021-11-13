const db = require('../db/db');

module.exports = async function newQuery(query, values) {
    let result = await db.pool.query({
        text: query,
        values
    });
    return result.rows;
}