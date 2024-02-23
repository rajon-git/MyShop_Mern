const { generateToken } = require("../config/jwtToken");
const User = require("../model/userModel");
const asyncHandler = require("express-async-handler");

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

const loginUserCtrl = asyncHandler(async (req, res) =>{
    const { email, password } = req.body;
     // check if user exists or not
    const findUser = await User.findOne({ email });
    if (findUser && (await findUser.isPasswordMatched(password))) {
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

const blockUser = asyncHandler(async(req,res)=>{
  const {id} = req.params;
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
const unblockUser = asyncHandler(async(req,res)=>{
  const {id} = req.params;
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

module.exports = {createUser,loginUserCtrl, getallUsers, getaUser, deleteUser,updateUser, blockUser, unblockUser};