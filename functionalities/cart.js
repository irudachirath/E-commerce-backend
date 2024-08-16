const express = require("express");
const router = express();

const db = require("../db");

let cart_item;

// Get all items and total value in the cart of a user
router.get("/:id", async (req, res) => {
  const sql = `select it.item_id, pr.title,it.price,ci.quantity,it.image,
                          sum(it.price * ci.quantity) as total_value
                      from cart_item ci
                      join item it using(item_id)
                      join product pr using(product_id)
                      join cart ca using(cart_id)
                      join customer cu using(customer_id)
                      where cu.customer_id = ?
                      group by pr.title,it.price,ci.quantity,it.image,it.item_id;`;

  const sql2 = `select t.attribute_name, t.variant_name 
                  from (select a.attribute_id, a.name attribute_name, v.name variant_name from attribute a 
                      left join variant v using(variant_id)) t 
                      right join (select * from item_configuration where Item_id = ?) x 
                      using(attribute_id);`;

  const [cart_item] = await db.query(sql, req.params.id);
  const cart_item1 = await Promise.all(
    cart_item.map(async (item) => {
      const [variant] = await db.query(sql2, item.item_id);
      item.variant = variant;
      return item;
    })
  );
  res.send(cart_item1);
  console.log(cart_item);
});

// router.post('/:id/:item/:num', async (req,res)=>{

//     const sql = `insert into cart_item values(?,?,?)
//                     on duplicate key update
//                     quantity = quantity+?`;
//     db.query(sql,[req.params.id,req.params.item,req.params.num,parseInt(req.params.num)]);
// });

// Add a new item to the cart of a user
router.post("/:id/:item/:num", async (req, res) => {
  const sql1 = `SELECT is_registered FROM customer WHERE customer_id = ?`;
  const sql2 = `SELECT cart_id FROM cart WHERE customer_id = ?`;
  const sql3 = `INSERT INTO cart (customer_id, total) VALUES (?, 0)`;
  const sql4 = `INSERT INTO cart_item (Cart_id, Item_id, Quantity)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE quantity = quantity + ?`;

  try {
    const [[{ is_registered }]] = await db.query(sql1, [req.params.id]);
    if (!is_registered) {
      return res.send("You are not registered yet. Please get registered.");
    }

    let [[cart]] = await db.query(sql2, [req.params.id]);
    if (!cart) {
      await db.query(sql3, [req.params.id]);
      [[cart]] = await db.query(sql2, [req.params.id]); // Re-fetch cart_id after creating
    }

    const cart_id = cart.cart_id;
    await db.query(sql4, [
      cart_id,
      req.params.item,
      req.params.num,
      parseInt(req.params.num),
    ]);
    res.send("Item added to cart.");
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).send("Failed to add item to cart.");
  }
});

router.delete("/:customerId/:itemId", async (req, res) => {
  const { customerId, itemId } = req.params;

  try {
    // Fetch the cart ID for the given customer ID
    const [cartRows] = await db.query(
      "SELECT cart_id FROM cart WHERE Customer_id = ?",
      [customerId]
    );

    if (cartRows.length === 0) {
      return res
        .status(404)
        .json({ message: "Cart not found for this customer." });
    }

    // Assuming the cart_id is correctly retrieved
    const cart_id = cartRows[0].cart_id;

    // Delete the item from the cart_item table
    await db.query("DELETE FROM cart_item WHERE Cart_id = ? AND Item_id = ?", [
      cart_id,
      itemId,
    ]);

    res.status(200).json({ message: "Item removed successfully" });
  } catch (error) {
    console.error("Failed to remove item from cart:", error);
    res.status(500).send("Error removing item from cart");
  }
});

module.exports = router;
