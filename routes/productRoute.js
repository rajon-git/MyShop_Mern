const express = require("express");
const { createProduct, getaproduct,getallProduct, updateProduct } = require("../controller/productCtrl");
const router = express.Router();

router.post("/", createProduct);
router.get("/:id", getaproduct);
router.get("/", getallProduct);
router.put("/:id", updateProduct);

module.exports = router;