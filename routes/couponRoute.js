const express = require("express");
const { createCoupon, getallCoupon, updateCoupon } = require("../controller/couponCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/",authMiddleware,isAdmin, createCoupon);
router.get("/",authMiddleware,isAdmin, getallCoupon);
router.put("/",authMiddleware,isAdmin, updateCoupon);

module.exports = router;