const db = require("../db");

module.exports.getAllProducts = async () => {
  const [products] = await db.query(
    "SELECT *, GetMinPrice(product_id) AS Min_price FROM product"
  );
  return products;
};

// module.exports.getUniqueProduct = async (id) => {
//     const [unique_product] = await db.query("SELECT * FROM products WHERE Product_id = ?", [id]);
//     return unique_product;
// }

module.exports.getUniqueProduct = async (id) => {
  let items;
  const [unique_product] = await db.query(
    `
        SELECT Product_id,Title,SKU,Weight,Description,p.Image,
                    MIN(price) as Min_price
        FROM product p
        LEFT JOIN item i using(product_id)
        WHERE p.Product_id = ?`,
    [id]
  );
  [items] = await db.query(
    `
        SELECT * FROM item WHERE Product_id = ?`,
    [id]
  );
  const sql = `select t.attribute_name, t.variant_name 
                    from (select a.attribute_id, a.name attribute_name, v.name variant_name from attribute a 
                        left join variant v using(variant_id)) t 
                        right join (select * from item_configuration where Item_id = ?) x 
                        using(attribute_id);`;
  items = await Promise.all(
    items.map(async (item) => {
      const [variant] = await db.query(sql, item.Item_id);
      item.variant = variant;
      return item;
    })
  );
  return [unique_product, items];
};

module.exports.deleteUniqueProduct = async (id) => {
  const [details] = await db.query(
    "DELETE FROM products WHERE Product_id = ?",
    [id]
  );
  return details.affectedRows;
};

module.exports.addOrUpdateProduct = async (obj, id = 0) => {
  const [[[{ affectedRows }]]] = await db.query(
    "CALL products_add_or_update(?,?,?,?,?,?,?)",
    [
      id,
      obj.Title,
      obj.SKU,
      obj.Weight,
      obj.Description,
      obj.Image,
      obj.main_category,
    ]
  );
  return affectedRows;
};
