const db = require('../db');

module.exports.getAllCarts = async () => {
    const [carts] = await db.query("SELECT * FROM carts");
    return carts;
}

module.exports.getUniqueCart = async (id) => {
    const [unique_cart] = await db.query("SELECT * FROM carts WHERE Cart_id = ?", [id]);
    return unique_cart;
}

module.exports.deleteUniqueCart = async (id) => {
    const [details] = await db.query("DELETE FROM carts WHERE Cart_id = ?", [id]);
    return details.affectedRows;
}

module.exports.addOrUpdateCart = async (obj, id=0) => {
    const [[[{affectedRows}]]] = await db.query("CALL carts_add_or_update(?,?,?)", 
        [id, obj.Customer_id, obj.Total_value]);
    return affectedRows;
}