const express = require("express");
const { createProduct, getaproduct } = require("../controller/productCtrl");
const router = express.Router();

router.post("/", createProduct);
router.get("/:id", getaproduct);

module.exports = router;