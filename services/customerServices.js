const db = require("../db");

module.exports.getAllCustomers = async () => {
  const [customers] = await db.query("SELECT * FROM customer");
  return customers;
};

module.exports.getUniqueCustomer = async (id) => {
  const [unique_customer] = await db.query(
    "SELECT * FROM customer WHERE Customer_id = ?",
    [id]
  );
  return unique_customer;
};

module.exports.deleteUniqueCustomer = async (id) => {
  const [details] = await db.query(
    "DELETE FROM customer WHERE Customer_id = ?",
    [id]
  );
  return details.affectedRows;
};

module.exports.addOrUpdateCustomer = async (obj, id = 0) => {
  const [[[{ affectedRows }]]] = await db.query(
    "CALL customers_add_or_update(?,?,?,?,?,?,?,?,?,?,?,?)",
    [
      id,
      obj.Password,
      obj.First_name,
      obj.Last_name,
      obj.Email,
      obj.Phone_number,
      obj.Address_line1,
      obj.Address_line2,
      obj.City,
      obj.Province,
      obj.Zipcode,
      obj.Is_registered,
    ]
  );
  return affectedRows;
};
