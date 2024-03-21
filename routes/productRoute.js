const express = require("express");
const { createProduct, getaproduct,getallProduct, updateProduct, deleteProduct, addToWishlist,rating } = require("../controller/productCtrl");
const { isAdmin,authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/",authMiddleware,isAdmin, createProduct);


router.get("/:id", getaproduct);
router.put("/wishlist",authMiddleware, addToWishlist);
router.put("/rating",authMiddleware, rating);

router.get("/", getallProduct);
router.put("/:id",authMiddleware,isAdmin, updateProduct);
router.delete("/:id",authMiddleware,isAdmin, deleteProduct);

module.exports = router;