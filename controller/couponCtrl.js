const Coupon = require("../model/couponModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

const createCoupon = asyncHandler(async(req,res)=>{
    try {
        const newCoupon = await Coupon.create(req.body);
        res.json(newCoupon);
    } catch (error) {
        throw new Error(error);
    }
})

const getallCoupon = asyncHandler(async(req,res)=>{
    try {
        const getallCoupon = await Coupon.find();
        res.json(getallCoupon);
    } catch (error) {
        throw new Error(error);
    }
})

module.exports = {createCoupon, getallCoupon}