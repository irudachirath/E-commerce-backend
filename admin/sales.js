const express = require('express');
const router = express();

const db = require('../db');

router.get('/:year/:quarter', async (req,res) => {
    sql = `CALL get_sales_quantity(?, ?)`;
    const [data] = await db.query(sql,[req.params.year, req.params.quarter]);
    res.send(data); 
    console.log(data);
});

router.get('/:year/:quarter/c/:category', async (req,res) => {
    sql = `CALL get_sales_of_a_category(?, ?, ?)`;
    const [data] = await db.query(sql,
        [req.params.category, req.params.year, req.params.quarter]);
    res.send(data); 
    console.log(data);
});

router.get('/:year/:quarter/p/:product', async (req,res) => {
    sql = `CALL get_sales_of_a_product(?, ?, ?)`;
    const [data] = await db.query(sql,
        [req.params.product, req.params.year, req.params.quarter]);
    res.send(data); 
    console.log(data);
});

router.get('/:year/:quarter/n/:number', async (req,res) => {
    sql = `CALL get_most_sellings(?, ?, ?)`;
    const [data] = await db.query(sql,
        [req.params.year, req.params.quarter, req.params.number]);
    res.send(data); 
    console.log(data);
});

module.exports = router;