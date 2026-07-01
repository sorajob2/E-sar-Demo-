const mysql = require("mysql2");
const fs = require("fs");
const path = require("path");

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  ssl: {
    ca: fs.readFileSync(
      path.resolve(process.env.DB_SSL_CA)
    )
  }
});

module.exports = db.promise();