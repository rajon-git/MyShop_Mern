const fs = require("fs");
const asyncHandler = require("express-async-handler");

const {
  cloudinaryUploadImg,
  cloudinaryDeleteImg,
} = require("../utils/cloudinary");


const uploadImages = asyncHandler(async (req, res) => {
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
      const images = urls.map((file)=>{
        return file
      });
       res.json(images);
      // const findProduct = await Product.findByIdAndUpdate(
      //   id,
      //   {
      //     $push: { images: { $each: urls } },
      //   },
      //   {
      //     new: true,
      //   }
      // );
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "fail", message: "Internal Server Error" });
    }
  });

  const deleteImages = asyncHandler(async (req, res) => {
    const {id} = req.params;
    try {
      cloudinaryDeleteImg(id, "images");
      res.json({message: "Deleted"});
    } catch (error) {
      console.error(error);
      res.status(500).json({ status: "fail", message: "Internal Server Error" });
    }
  });

module.exports = {
  uploadImages,
  deleteImages,
};