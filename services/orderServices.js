const db = require('../db');

module.exports.getAllOrders = async () => {
    const [orders] = await db.query("SELECT * FROM orders");
    return orders;
}

module.exports.getUniqueOrder = async (id) => {
    const [unique_order] = await db.query("SELECT * FROM orders WHERE Order_id = ?", [id]);
    return unique_order;
}

module.exports.deleteUniqueOrder = async (id) => {
    const [details] = await db.query("DELETE FROM orders WHERE Order_id = ?", [id]);
    return details.affectedRows;
}

module.exports.addOrUpdateOrder = async (obj, id=0) => {
    const [[[{affectedRows}]]] = await db.query("CALL orders_add_or_update(?,?,?,?,?,?,?,?,?,?)", 
        [id, obj.Cart_id, obj.Date, obj.Payment_id, obj.Delivery_id,
        obj.Address_line1, obj.Address_line2, obj.City, obj.Province, obj.Zipcode]);
    return affectedRows;
}