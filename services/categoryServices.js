const db = require("../db");

module.exports.getMainCategories = async () => {
  const [main_categories] = await db.query(
    "SELECT * FROM category WHERE Parent_category_id IS NULL"
  );
  return main_categories;
};

module.exports.getMainCategories = async () => {
  const [main_categories] = await db.query(
    "SELECT * FROM category WHERE Parent_category_id IS NULL"
  );
  return main_categories;
};

module.exports.getSubCategories = async () => {
  const [sub_categories] = await db.query(
    "SELECT * FROM category WHERE Parent_category_id IS NOT NULL"
  );
  return sub_categories;
};

module.exports.getAllCategories = async () => {
  const [all_categories] = await db.query("SELECT * FROM category");
  return all_categories;
};

module.exports.getUniqueCategory = async (id) => {
  const [unique_main_category] = await db.query(
    `SELECT 
        p.Product_id, 
        p.Title, 
        p.SKU, 
        p.Weight, 
        p.Description, 
        p.Image, 
        GetMinPrice(p.Product_id) AS price
    FROM product_category pc
    JOIN product p USING (product_id)
    WHERE category_id = ?`,
    [id]
  );
  return unique_main_category;
};

module.exports.deleteUniqueCategory = async (id) => {
  const [details] = await db.query(
    "DELETE FROM main_categories WHERE Order_id = ?",
    [id]
  );
  return details.affectedRows;
};

module.exports.addOrUpdateCategory = async (obj, id = 0) => {
  const [[[{ affectedRows }]]] = await db.query(
    "CALL categories_add_or_update(?,?,?)",
    [id, obj.Name, obj.Image]
  );
  return affectedRows;
};
