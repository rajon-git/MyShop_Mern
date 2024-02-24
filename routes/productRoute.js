const express = require("express");
const { createProduct, getaproduct,getallProduct } = require("../controller/productCtrl");
const router = express.Router();

router.post("/", createProduct);
router.get("/:id", getaproduct);
router.get("/", getallProduct);

module.exports = router;