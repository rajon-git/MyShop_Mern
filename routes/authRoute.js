const express = require("express");
const {
    createUser,
    loginUserCtrl,
    logout, 
    getallUsers,
    handleRefreshToken, 
    getaUser, 
    deleteUser,
    updateUser, 
    blockUser, 
    unblockUser,
    updatePassword,
    forgotPasswordToken
} = require("../controller/userCtrl");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/password",authMiddleware, updatePassword);
router.post("/login",loginUserCtrl);
router.get("/all-users",getallUsers);
router.get("/refresh",handleRefreshToken);
router.get("/logout",logout);


router.get("/:id",authMiddleware,isAdmin, getaUser);
router.delete("/:id",deleteUser);
router.put("/:id",authMiddleware,updateUser);
router.put("/block-user/:id",authMiddleware,isAdmin,blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser);


module.exports = router;