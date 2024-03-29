const Blog = require("../model/blogModel");
const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const cloudinaryUploadImg = require("../utils/cloudinary");
const fs = require("fs");


const createBlog = asyncHandler(async(req,res)=>{
    try {
        const newBlog = await Blog.create(req.body);
        res.json(newBlog);
    } catch (error) {
        throw new ErrorEvent(error);
    }
});

const updateBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const updateBlog = await Blog.findByIdAndUpdate(id, req.body, {new: true});
        res.json(updateBlog);
    } catch (error) {
        throw new ErrorEvent(error);
    }
});

//get blog

const getBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const getBlog = await Blog.findById(id)
        .populate("likes")
        .populate("disLikes");
        await Blog.findByIdAndUpdate(id, {
            $inc:{numViews: 1}
        }, {new: true});
        res.json(getBlog);
    } catch (error) {
        throw new Error(error);
    }
});

const getAllBlog = asyncHandler(async(req,res)=>{
    try {
        const getBlogs = await Blog.find();
        res.json(getBlogs);
    } catch (error) {
        throw new ErrorEvent(error);
    }
});

const deleteBlog = asyncHandler(async(req,res)=>{
    const {id} = req.params;
    validateMongoDbId(id);
    try {
        const deleteBlog = await Blog.findByIdAndDelete(id);
        res.json(deleteBlog);
    } catch (error) {
        throw new ErrorEvent(error);
    }
});

//like a blog 
const likeBlog = asyncHandler(async(req,res)=>{
    const {blogId} =  req.body;
    validateMongoDbId(blogId);
    //find the blog which you will like
    const blog = await Blog.findById(blogId);
    //find the user who will like
    const loginUserId = req?.user?._id;
    //find if the user has liked already
    const isLiked = blog?.isLiked;
     //find if the user has disliked already
     const isdisLiked = blog?.disLikes?.find(
        (UserId => UserId?.toString()===loginUserId.toString()));

        if(isdisLiked){
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: {disLikes: loginUserId},
                isDisLiked: false
            },{
                new: true
            });
            res.json(blog);
        }

        if(isLiked){
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $pull: {likes: loginUserId},
                isLiked: false
            },{
                new: true
            });
            res.json(blog);
        }
        else
        {
            const blog = await Blog.findByIdAndUpdate(blogId, {
                $push: {likes: loginUserId},
                isLiked: true
            },{
                new: true
            });
            res.json(blog);
        }
});

//dis like a blog

const dislikeBlog = asyncHandler(async (req, res) => {
    const { blogId } = req.body;
    validateMongoDbId(blogId);
    // Find the blog which you want to be liked
    const blog = await Blog.findById(blogId);
    // find the login user
    const loginUserId = req?.user?._id;
    // find if the user has liked the blog
    const isDisLiked = blog?.isDisLiked;
    // find if the user has disliked the blog
    const alreadyLiked = blog?.likes?.find(
      (userId) => userId?.toString() === loginUserId?.toString()
    );
    if (alreadyLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { likes: loginUserId },
          isLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    }
    if (isDisLiked) {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $pull: { disLikes: loginUserId },
          isDisLiked: false,
        },
        { new: true }
      );
      res.json(blog);
    } else {
      const blog = await Blog.findByIdAndUpdate(
        blogId,
        {
          $push: { disLikes: loginUserId },
          isDisLiked: true,
        },
        { new: true }
      );
      res.json(blog);
    }
  });

  const uploadImges = asyncHandler(async (req, res) => {
    const { id } = req.params;
    validateMongoDbId(id);
    try {
        const uploader = (path) => cloudinaryUploadImg(path, "images");
        const urls = [];
        const files = req.files;
        for (const file of files) {
          const { path } = file;
          const newpath = await uploader(path);
          urls.push(newpath);
          fs.unlinkSync(path);
        }
    
        const findBlog = await Blog.findByIdAndUpdate(
          id,
          {
            $push: { images: { $each: urls } },
          },
          {
            new: true,
          }
        );
        res.json(findBlog);
    } catch (error) {
      console.error('Error processing image upload:', error);
      res.status(500).json({ status: 'fail', message: 'Internal Server Error', error: error.message });
    }
  });
  
  

module.exports = {
    createBlog,
    updateBlog, 
    getBlog, 
    getAllBlog, 
    deleteBlog, 
    likeBlog, 
    dislikeBlog,
    uploadImges};