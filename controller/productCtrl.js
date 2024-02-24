const Product = require("../model/productModel");
const asyncHandler = require("express-async-handler");

//create product
const createProduct = asyncHandler(async(req,res)=>{
    try {
        const newProduct = await Product.create(req.body);
        res.json(newProduct);
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = {createProduct}