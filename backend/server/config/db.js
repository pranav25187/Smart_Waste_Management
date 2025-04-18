const mysql = require('mysql2');
require('dotenv').config();

// Create a pool of connections
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: false  // Optional: depending on your provider's SSL settings
  }
});

// Attempt to connect and log the result
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Failed to connect to the database:', err.message);
    return;
  }

  console.log('✅ Connected to the database successfully');
  connection.release();  // Release the connection back to the pool
});

// Export the pool wrapped with promises
module.exports = pool.promise();
