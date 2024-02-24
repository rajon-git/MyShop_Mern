const express = require("express");
const { createProduct, getaproduct,getallProduct, updateProduct, deleteProduct } = require("../controller/productCtrl");
const router = express.Router();

router.post("/", createProduct);
router.get("/:id", getaproduct);
router.get("/", getallProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;