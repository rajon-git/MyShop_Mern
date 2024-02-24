const slugify  = require("slugify");
const Product = require("../model/productModel");
const asyncHandler = require("express-async-handler");

//create product
const createProduct = asyncHandler(async (req, res) => {
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const newProduct = await Product.create(req.body);
      res.json(newProduct);
    } catch (error) {
      throw new Error(error);
    }
  });

//get a product

const getaproduct = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    try {
        const findProduct = await Product.findById(id);
        res.json(findProduct);
    } catch (error) {
        throw new Error(error);
    }
})

//get all produxt

const getallProduct = asyncHandler(async(req,res)=>{
    try {
        const getallProduct = await Product.find();
        res.json(getallProduct);
    } catch (error) {
        throw new Error(error);
    }
});


//update products

const updateProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
      if (req.body.title) {
        req.body.slug = slugify(req.body.title);
      }
      const updateProduct = await Product.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.json(updateProduct);
    } catch (error) {
      throw new Error(error);
    }
  });

  const deleteProduct = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
      const deleteProduct = await Product.findByIdAndDelete(id);
      res.json(deleteProduct);
    } catch (error) {
      throw new Error(error);
    }
  });

module.exports = {createProduct,getaproduct,getallProduct, updateProduct, deleteProduct}