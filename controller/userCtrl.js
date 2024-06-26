const { generateToken } = require("../config/jwtToken");
const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("./emailCtrl");
const Product = require("../model/productModel");
const Cart = require("../model/cartModel");
const Coupon = require("../model/couponModel");
const Order = require("../model/orderModel");
const uniqid =require("uniqid");
const OTP = require("../model/otpModel")

const SendEmailUtility = require("../utils/SMTPEmail")

const createUser = asyncHandler(async(req,res)=>{
    const email = req.body.email;
    const findUser = await User.findOne({email:email});

    if(!findUser)
    {
        const newUser = await User.create(req.body);
        res.json(newUser);
    }
    else
    {
        throw new Error("User Already Exists")
    }
});

//user login

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = generateRefreshToken(findUser?._id);
    // const updateuser = await User.findByIdAndUpdate(
    //   findUser.id,
    //   {
    //     refreshToken: refreshToken,
    //   },
    //   { new: true }
    // );
    // Update the user document with the new refresh token
    await User.findByIdAndUpdate(findUser._id, { refreshToken });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstName: findUser?.firstName,
      lastName: findUser?.lastName,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});

//admin login

const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findAdmin = await User.findOne({ email });
  if(findAdmin.role !== "admin") throw new Error("Not Authorized");
  if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findAdmin?._id);
    const updateuser = await User.findByIdAndUpdate(
      findAdmin.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findAdmin?._id,
      firstName: findAdmin?.firstName,
      lastName: findAdmin?.lastName,
      email: findAdmin?.email,
      mobile: findAdmin?.mobile,
      token: generateToken(findAdmin?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});
//handle refresh token controller

const handleRefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) throw new Error(" No Refresh token present in db or not matched");
  jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err || user.id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }
    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});

//logout controller

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204); // forbidden
  }
  await User.findOneAndUpdate({refreshToken}, {
    refreshToken: "",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204); // forbidden
});



//get all user controller

const getallUsers = asyncHandler(async(req,res)=>{
   try {
    const users = await User.find();
    res.json(users);
   } catch (error) {
    throw new Error(error);
   }
})

//update user controller

const updateUser = asyncHandler(async(req,res)=>{
    const {id} = req.user;
    validateMongoDbId(id);
    const updateUser =  await User.findByIdAndUpdate(id, {
      firstName : req?.body?.firstName,
      lastName : req?.body?.lastName,
      mobile: req?.body?.mobile,
      email: req?.body?.email,
    },{
      new:true
    });
    res.json(updateUser);
  try {
    
  } catch (error) {
    throw new Error(error);
  }
})

const saveAddress = asyncHandler(async (req, res, next) => {
  const { _id } = req.user;
  validateMongoDbId(_id);

  try {
    const addressupdate = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );
    res.json(addressupdate);
  } catch (error) {
    throw new Error(error);
  }
});

//get a single user controller

const getaUser = asyncHandler(async(req,res)=>{
  const {id} = req.params;
  validateMongoDbId(id);
  try {
    const getaUser = await User.findById(id);
    res.json({getaUser});
  } catch (error) {
    throw new Error(error);
  }
})

//delete a single user controller

const deleteUser = asyncHandler(async(req,res)=>{
  const {id} = req.params;
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    res.json({deleteUser});
  } catch (error) {
    throw new Error(error);
  }
})

//block controller add

const blockUser = asyncHandler(async(req,res)=>{
  const {id} = req.params;
  validateMongoDbId(id);
  try {
    const block = await User.findByIdAndUpdate(id, {
      isBlocked: true
    },{
      new:true
    });
    res.json(block);
  } catch (error) {
    throw new Error(error);
  }
});

//unblock controller create

const unblockUser = asyncHandler(async(req,res)=>{
  const {id} = req.params;
  validateMongoDbId(id);
  try {
    const unblock = await User.findByIdAndUpdate(id, {
      isBlocked: false
    },{
      new:true
    });
    res.json(unblock);
  } catch (error) {
    throw new Error(error);
  }
});

//update password

const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongoDbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});

const forgotPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
      res.status(404).json({
          status: "fail",
          message: "User not found with this email",
      });
      return;
  }

  try {
      const token = await user.createPasswordResetToken();
      await user.save();
      const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:3000/reset-password/${token}'>Click Here</a>`;
      const data = {
          to: email,
          text: "Hey User",
          subject: "Forgot Password Link",
          htm: resetURL,
      };

      await sendEmail(data);

      res.json({
          status: "success",
          message: "Password reset link sent successfully",
          token
      });
  } catch (error) {
      console.error("Error in forgotPasswordToken:", error);
      res.status(500).json({
          status: "fail",
          message: "Internal Server Error",
      });
  }
});

//reset password controller
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error(" Token Expired, Please try again later");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json(user);
});

const RecoverVerifyEmail = asyncHandler(async (req, res) => {
  let email = req.params.email;
  let OTPCODE = Math.floor(100000 + Math.random() * 900000);
  // console.log(OTP)
  try {
    let userCount = await User.aggregate([
      { $match: { email } },
      { $count: "total" },
    ]);
    if (userCount.length > 0) {
      await OTP.create({ email, otp: OTPCODE });
      // Email Send
      let SendEmail = await SendEmailUtility(
        email,
        OTPCODE,
        "Task Manager PIN Verification"
      );
      res.status(200).json({ status: "success", data: SendEmail });
    } else {
      res.status(200).json({ status: "fail", data: "User Not Found" });
    }
  } catch (error) {
    // console.log(error);
    res.status(400).json({ status: "fail=", error: error.message });
  }
})

// Recover Verify OTP
const VerifyOTP = asyncHandler(async (req, res) => {
  let email = req.params.email;
  let otp = req.params.otp;
  let status = 0;
  let updateStatus = 1;

  try {
    let otpCount = await OTP.aggregate([
      { $match: { email, otp, status } },
      { $count: "total" },
    ]);

    if (otpCount.length > 0) {
      let OTPUpdate = await OTP.updateOne(
        { email, otp, status },
        { status: updateStatus }
      );
      res.status(200).json({ status: "success", data: OTPUpdate });
    } else {
      res.status(400).json({ status: "fail", data: "Invalid OTP" });
    }
  } catch (error) {
    // console.log(error);
    res.status(400).json({ status: "fail", error: error.message });
  }
})

// Reset Password
const ResetPassword = asyncHandler(async (req, res) => {
  let { email, otp, password } = req.body;
  let status = 1;
  try {
    let otpCount = await OTP.aggregate([
      { $match: { email, otp, status } },
      { $count: "total" },
    ]);

    if (otpCount.length > 0) {
      let updatePass = await User.updateOne({ email }, { password });
      res.status(200).json({ status: "success", data: updatePass });
    } else {
      res.status(200).json({ status: "fail", data: "Invalid Request" });
    }
  } catch (error) {
    // console.log(error);
    res.status(400).json({ status: "fail", error: error.message });
  }
})

const getWishList = asyncHandler(async(req,res)=>{
  const {_id} = req.user;
  try {
    const findUser = await User.findById(_id).populate("wishlist");
    res.json(findUser);
  } catch (error) {
    throw new Error(error);
  }
});

//add to cart

// const userCart = asyncHandler(async (req, res) => {
//   const { productId,color,quantity,price } = req.body;
//   const { _id } = req.user;
//   validateMongoDbId(_id);
//   try {
//     let newCart = await new Cart({
//       userId: _id,
//       productId,
//       color,
//       price,
//       quantity
//     }).save();
//     res.json(newCart);
//   } catch (error) {
//     throw new Error(error);
//   }
// });

const userCart = asyncHandler(async (req, res) => {
  const { productId,color,quantity,price } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cartTotal = price * quantity;
    console.log(cartTotal);
    let newCart = await new Cart({
      userId: _id,
      productId,
      color,
      price,
      quantity,
      cartTotal
    }).save();
    res.json(newCart);
  } catch (error) {
    throw new Error(error);
  }
});

const getUsercart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const cart = await Cart.find({ userId: _id }).populate(
      "productId"
    ).populate("color");
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
});

const removeProductFromCart= asyncHandler(async(req,res)=>{
  const {_id} = req.user;
  const {cartItemId} = req.params;
  validateMongoDbId(_id);
  try {
    const deleteProductFromCart = await Cart.deleteOne({userId:_id,_id:cartItemId});
    res.json(deleteProductFromCart);
  } catch (error) {
    throw new Error(error);
  }
})

const updateQuantityFromCart=asyncHandler(async(req,res)=>{
  const {_id} = req.user;
  const {cartItemId,newQuantity} = req.params;
  validateMongoDbId(_id);
  try {
    const cartItem = await Cart.findOne({userId:_id,_id:cartItemId});
    cartItem.quantity = newQuantity;
    cartItem.cartTotal = cartItem.price * newQuantity;
    cartItem.save();
    res.json(cartItem);
  } catch (error) {
    throw new Error(error);
  }
})

const createOrder = asyncHandler(async(req,res)=>{
  const {shippingInfo,orderItems,totalPrice,totalPriceAfterDiscount,paymentInfo} = req.body;
  const {_id}= req.user;

  try {
    const order = await Order.create({
      shippingInfo,orderItems,totalPrice,totalPriceAfterDiscount,paymentInfo,user:_id
    })
    res.status(201).json({
      order,
      success:true
    })
  } catch (error) {
    throw new Error(error);
  }
})


const getMyOrders = asyncHandler(async(req,res)=>{
  const {_id} = req.user;
  try {
    const orders = await Order.find({user:_id}).populate("user").populate("orderItems.product").populate("orderItems.color");
    res.json({
      orders
    })
  } catch (error) {
    throw new Error(error);
  }
})

const getMonthWiseOrderIncome = asyncHandler(async(req,res)=>{
  let monthNames= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];
  let d = new Date();
  let endDate = "";
  d.setDate(1);
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth()-1);
    endDate = monthNames[d.getMonth()]+ " " + d.getFullYear()
    
  }
  const data = await Order.aggregate([
    {
      $match : {
        createdAt: {
          $lte:new Date(),
          $gte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id:{
          month:"$month"
        },
        amount:{$sum:"$totalPriceAfterDiscount"},count:{ $sum:1 }
      }
    }
  ])
  res.json(data);
})


const getYearlyTotalIncome = asyncHandler(async(req,res)=>{
  let monthNames= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];
  let d = new Date();
  let endDate = "";
  d.setDate(1);
  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth()-1);
    endDate = monthNames[d.getMonth()]+ " " + d.getFullYear()
    
  }
  const data = await Order.aggregate([
    {
      $match : {
        createdAt: {
          $lte:new Date(),
          $gte: new Date(endDate)
        }
      }
    },
    {
      $group: {
        _id:null,
        count:{ $sum: 1 },
        amount:{ $sum: "$totalPriceAfterDiscount" }
      }
    }
  ])
  res.json(data);
})

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const alluserorders = await Order.find().populate("user");
    res.json(alluserorders);
  } catch (error) {
    throw new Error(error);
  }
});

const getSingleOrder = asyncHandler(async (req, res) => {
  const {id} = req.params;
  try {
    const orders = await Order.findOne({_id:id}).populate("orderItems.product").populate("user").populate("orderItems.color");
    res.json({orders});
  } catch (error) {
    throw new Error(error);
  }
});

const updateOrder = asyncHandler(async (req, res) => {
  const {id} = req.params;
  try {
    const orders = await Order.findById(id);
    orders.orderStatus= req.body.status;
    await orders.save();
    res.json({orders});
  } catch (error) {
    throw new Error(error);
  }
});

const applyCoupon = asyncHandler(async (req, res) => {
  const { coupon } = req.body;
  const { _id } = req.user;
  validateMongoDbId(_id);
  
  // Find the valid coupon
  const validCoupon = await Coupon.findOne({ name: coupon });

  if (!validCoupon) {
    throw new Error("Invalid Coupon");
  }

  // Check if the coupon is expired
  if (validCoupon.expiryDate < new Date()) {
    throw new Error("Coupon has expired");
  }

  // Find the user's cart
  const userCart = await Cart.find({ userId: _id });

  if (!userCart || userCart.length === 0) {
    throw new Error("Cart not found for the user.");
  }

  let cartTotal = 0;

  // Calculate total price of all products in the cart
  for (const cartItem of userCart) {
    cartTotal += cartItem.cartTotal;
  }

  // Calculate the total price after discount
  const totalAfterDiscount = cartTotal - validCoupon.discount;
  
  if (totalAfterDiscount < 0) {
    throw new Error("Coupon discount is greater than cart total.");
  }

  // Update the totalAfterDiscount field in the cart model for the user
  await Cart.updateMany(
    { userId: _id },
    { $set: { totalAfterDiscount } },
    { new: true }
  );

  res.json({ totalAfterDiscount });
});



const deleteCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;
  
  // Validate the couponId
  validateMongoDbId(couponId);

  // Find the coupon by its ID
  const coupon = await Coupon.findById(couponId);

  if (!coupon) {
    throw new Error("Coupon not found.");
  }

  // Delete the coupon
  await coupon.remove();

  res.json({ message: "Coupon deleted successfully." });
});



const emptyCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  validateMongoDbId(_id);
  try {
    const deleteCart = await Cart.deleteMany({userId: _id});
    res.json(deleteCart);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = {
                 createUser,
                 loginUserCtrl, 
                 getallUsers, 
                 getaUser, 
                 logout,
                 deleteUser,
                 updateUser,
                 handleRefreshToken, 
                 blockUser, 
                 unblockUser,
                 updatePassword,
                 forgotPasswordToken,
                 resetPassword,
                 loginAdmin,
                 getWishList,
                 saveAddress,
                 userCart,
                 getUsercart,
                 createOrder,
                 getMyOrders,
                 removeProductFromCart,
                 updateQuantityFromCart,
                 getMonthWiseOrderIncome,
                 getYearlyTotalIncome,
                 getAllOrders,
                 getSingleOrder,
                 updateOrder,
                 applyCoupon,
                 emptyCart,
                 deleteCoupon,
                 ResetPassword,
                 VerifyOTP,
                 RecoverVerifyEmail
                };