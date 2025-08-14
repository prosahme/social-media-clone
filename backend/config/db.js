const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) console.log("DB connection error:", err);
  else console.log("Connected to MYSQL database");
});

module.exports = db;
