const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '82.112.237.161',  // Replace with your MySQL host
  port: 1234,             // Replace with your MySQL port
  user: 'root',          // Replace with your MySQL username
  password: 'lqBgXSgJVAiCRMKMP1wFzSNYqfdpe89NM5R34elbohTu6rbdO178b4H18HkYbbUs', // Replace with your MySQL password
  database: 'point_of_sale',    // Replace with your MySQL database name
  waitForConnections: true,
  connectionLimit: 10,    // Maximum connections in the pool
  queueLimit: 0
});

module.exports = pool;