const express = require("express");
const { createProduct, getaproduct,getallProduct,deleteImges, updateProduct, deleteProduct, addToWishlist,rating, uploadImges } = require("../controller/productCtrl");
const { isAdmin,authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages");
const router = express.Router();

router.post("/",authMiddleware,isAdmin, createProduct);
router.post("/upload/",authMiddleware,isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImges);

router.get("/:id", getaproduct);
router.put("/wishlist",authMiddleware, addToWishlist);
router.put("/rating",authMiddleware, rating);

router.get("/", getallProduct);
router.put("/:id",authMiddleware,isAdmin, updateProduct);
router.delete("/:id",authMiddleware,isAdmin, deleteProduct);
router.delete("/delete-img/:id",authMiddleware,isAdmin, deleteImges);

module.exports = router;