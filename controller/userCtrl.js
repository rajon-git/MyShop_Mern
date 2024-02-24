const { generateToken } = require("../config/jwtToken");
const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const jwt = require("jsonwebtoken");
const sendEmail = require("./emailCtrl");

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
        throw new Error("user Already Exists")
    }
});

const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check if user exists or not
  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
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
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
      mobile: findUser?.mobile,
      token: generateToken(findUser?._id),
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
  if (!user) throw new Error("User not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: resetURL,
    };
    sendEmail(data);
    res.json(token);
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
                 forgotPasswordToken
                };