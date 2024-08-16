const express = require('express');
const router = express();

const customerServices = require('../services/customerServices');

let customers;
router.get('/', async (req,res)=>{
    customers = await customerServices.getAllCustomers();
    res.send(customers);
});

let unique_customer;
router.get('/:id', async (req,res)=>{
    unique_customer = await customerServices.getUniqueCustomer(req.params.id);
    if (unique_customer.length == 0)
        res.status(404).json("No customer with the given id " + req.params.id);
    else
        res.send(unique_customer); 
});

router.delete('/:id', async (req,res)=>{
    let affectedRows = await customerServices.deleteUniqueCustomer(req.params.id);
    if( affectedRows == 0 ) res.status(404).json("No customer with the given id " + req.params.id);
    else res.send("Customer deleted successfully.");
});

router.post('/', async (req,res)=>{
    await customerServices.addOrUpdateCustomer(req.body);
    res.status(201).send("A new customer added successfully.");
});

router.put('/:id', async (req,res)=>{
    const affectedRows = await customerServices.addOrUpdateCustomer(req.body, req.params.id);
    if( affectedRows == 0 ) res.status(404).json("No customer with the given id " + req.params.id);
    else res.send("Customer updated successfully.");
});


module.exports = router;