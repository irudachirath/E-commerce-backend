const pool = require("mysql2/promise");

const mysqlPool = pool.createPool({
  host: "ecommerce-db.ctgs2e2oeqo4.ap-southeast-1.rds.amazonaws.com",
  user: "admin",
  password: process.env.DB_PASSWORD,
  database: "group32_V1.0",
  port: process.env.DB_PORT,
});

module.exports = mysqlPool;
