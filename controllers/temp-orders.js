const express = require('express');
const router = express();

const orderServices = require('../services/orderServices');

let orders;
router.get('/', async (req,res)=>{
    orders = await orderServices.getAllOrders();
    res.send(orders);
});

let unique_order;
router.get('/:id', async (req,res)=>{
    unique_order = await orderServices.getUniqueOrder(req.params.id);
    if (unique_order.length == 0)
        res.status(404).json("No order with the given id " + req.params.id);
    else
        res.send(unique_order); 
});

router.delete('/:id', async (req,res)=>{
    let affectedRows = await orderServices.deleteUniqueOrder(req.params.id);
    if( affectedRows == 0 ) res.status(404).json("No order with the given id " + req.params.id);
    else res.send("Order deleted successfully.");
});

router.post('/', async (req,res)=>{
    await orderServices.addOrUpdateOrder(req.body);
    res.status(201).send("A new order added successfully.");
});

router.put('/:id', async (req,res)=>{
    const affectedRows = await orderServices.addOrUpdateOrder(req.body, req.params.id);
    if( affectedRows == 0 ) res.status(404).json("No order with the given id " + req.params.id);
    else res.send("Order updated successfully.");
});


module.exports = router;