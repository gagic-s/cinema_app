const Pool = require('pg').Pool;

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: 'cinema',
    password: 'duleGagic2510@',
    port: '5432'
});

module.exports = pool;