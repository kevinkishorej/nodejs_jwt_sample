const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Jobs@420',
    port: 5432,
});

pool.connect();

module.exports = pool;
