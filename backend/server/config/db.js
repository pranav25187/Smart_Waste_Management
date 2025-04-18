const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306, // Fallback to default MySQL port
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    rejectUnauthorized: true, // Should be true for production
    ca: process.env.DB_SSL_CA // Add if Railway provides a CA cert
  }
});

// Test connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Database connection failed:', {
      error: err.message,
      code: err.code,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT
    });
    return;
  }
  console.log('✅ Database connected successfully');
  connection.release();
});

module.exports = pool.promise();
