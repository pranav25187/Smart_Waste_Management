const mysql = require('mysql2');
require('dotenv').config();

// Create a pool of connections
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,  // Maximum number of connections in the pool
  queueLimit: 0  // Unlimited queue length
});

// Export the pool wrapped with promises
module.exports = pool.promise();
