const Blog = require("../model/blogModel");
const user = require("../model/userModel");
const asyncHandler = require("express-async-handler");


const createBlog = asyncHandler(async(req,res)=>{
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (error) {
        throw new ErrorEvent(error);
    }
});

module.exports = {createBlog};