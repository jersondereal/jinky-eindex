const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3307,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'jinky_eindex',
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0
});

// Test the connection
pool.getConnection()
    .then(conn => {
        console.log('Connected to Database');
        conn.release();
    })
    .catch(err => {
        console.error('Error connecting to database:', err);
    });

module.exports = pool; 