const Category = require("../model/prodcategoryModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createCategory = asyncHandler(async(req,res)=>{
    try {
        const createCategory = await Category.create(req.body);
        res.json(createCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const updateCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const updateCategory = await Category.findByIdAndUpdate(id,req.body, {
            new: true
        });
        res.json(updateCategory);
    } catch (error) {
        throw new Error(error);
    }
});

const deleteCategory = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deleteCategory = await Category.findByIdAndDelete(id);
        res.json(deleteCategory);
    } catch (error) {
        throw new Error(error);
    }
});

module.exports = {createCategory, updateCategory, deleteCategory}