const express = require("express");
const { createCoupon, getallCoupon } = require("../controller/couponCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/",authMiddleware,isAdmin, createCoupon);
router.get("/",authMiddleware, getallCoupon);

module.exports = router;