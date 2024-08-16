const pool = require("mysql2/promise");

const mysqlPool = pool.createPool({
  host: "ecommerce-db.ctgs2e2oeqo4.ap-southeast-1.rds.amazonaws.com",
  user: "admin",
  password: "MySQL_Group32",
  database: "group32_V1.0",
  port: 3305,
});

module.exports = mysqlPool;
