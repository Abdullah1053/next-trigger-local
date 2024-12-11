const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '82.112.237.161',  // Replace with your MySQL host
  port: 21324,             // Replace with your MySQL port
  user: 'root',          // Replace with your MySQL username
  password: 'ZquvipF6G1cvBVJen4cOxzwEY17u4ALDbZQRNuciTY4BB6BGo3NsaoEDlb41of4l', // Replace with your MySQL password
  database: 'default',    // Replace with your MySQL database name
  waitForConnections: true,
  connectionLimit: 10,    // Maximum connections in the pool
  queueLimit: 0
});

module.exports = pool;