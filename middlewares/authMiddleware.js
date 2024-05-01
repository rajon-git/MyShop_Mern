const User = require("../model/userModel");
const jwt =  require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

// const authMiddleware = asyncHandler(async(req,res,next)=>{
//     let token;
//     if(req?.headers?.authorization && req?.headers?.authorization?.startsWith("Bearer"))
//     {
//         token = req?.headers?.authorization.split(" ")[1];
//         try {
//             if(token)
//             {
//                 const decode = jwt.verify(token, process.env.JWT_SECRET);
//                 const user = await User.findById(decode?._id);
//                 if (user) {
//                     req.user = user;
//                     next();
//                 } 
//                 else {
//                     throw new Error("User not found");
//                 }
//             }
//             else {
//                 throw new Error("Authorization header missing or invalid");
//             }
//         } catch (error) {
//             throw new Error("No authorized token, Please login again")
//         }
//     }
//     else
//     {
//         throw new Error("There is no token with header");
//     }
// });

const authMiddleware = asyncHandler(async (req, res, next) => {
    try {
        let token;
        if (req?.headers?.authorization && req?.headers?.authorization?.startsWith("Bearer")) {
            token = req?.headers?.authorization?.split(" ")[1];
            if (token) {
                const decode = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findById(decode.id);
                if (user) {
                    req.user = user;
                    next();
                } else {
                    throw new Error("User not found");
                }
            } else {
                throw new Error("Invalid token format");
            }
        } else {
            throw new Error("Authorization header missing or invalid");
        }
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
});


const isAdmin = asyncHandler(async(req,res,next)=>{
    const {email} = req.user;
    const adminUser = await User.findOne({email});
    if(adminUser.role !== "admin")
    {
        throw new Error("You are not an Admin");
    }
    else
    {
        next();
    }
})

module.exports = {authMiddleware, isAdmin};