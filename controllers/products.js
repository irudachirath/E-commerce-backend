const express = require('express');
const router = express();

const productServices = require('../services/productServices');

let products;
router.get('/', async (req,res)=>{
    products = await productServices.getAllProducts();
    res.send(products);
});

let unique_product;
router.get('/:id', async (req,res)=>{
    unique_product = await productServices.getUniqueProduct(req.params.id);
    if (unique_product.length == 0)
        res.status(404).json("No product with the given id " + req.params.id);
    else{
        console.log(unique_product);
        res.send(unique_product); 
    }
});

router.delete('/:id', async (req,res)=>{
    let affectedRows = await productServices.deleteUniqueProduct(req.params.id);
    if( affectedRows == 0 ) res.status(404).json("No product with the given id " + req.params.id);
    else res.send("Product deleted successfully.");
});

router.post('/', async (req,res)=>{
    await productServices.addOrUpdateProduct(req.body);
    res.status(201).send("A new product added successfully.");
});

router.put('/:id', async (req,res)=>{
    const affectedRows = await productServices.addOrUpdateProduct(req.body, req.params.id);
    if( affectedRows == 0 ) res.status(404).json("No product with the given id " + req.params.id);
    else res.send("Product updated successfully.");
});


module.exports = router;