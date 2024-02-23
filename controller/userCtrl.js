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

module.exports = {createUser,loginUserCtrl, getallUsers, getaUser};