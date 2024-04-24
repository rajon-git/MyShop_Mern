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
    forgotPasswordToken,
    resetPassword,
    loginAdmin,
    getWishList,
    saveAddress,
    userCart,
    getUsercart,
    emptyCart,
    applyCoupon,
    createOrder,
    getAllOrders,
    getOrders,
    updateOrderStatus,
    getOrderByUserId,
    removeProductFromCart
} = require("../controller/userCtrl");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);

router.put("/reset-password/:token", resetPassword);
router.put("/order/update-order/:id",authMiddleware,isAdmin, updateOrderStatus);

router.put("/password",authMiddleware, updatePassword);
router.post("/login",loginUserCtrl);
router.post("/admin-login",loginAdmin);
router.post("/cart",authMiddleware, userCart);
router.post("/cart/applycoupon",authMiddleware, applyCoupon);
router.post("/cart/cash-order",authMiddleware, createOrder);

router.get("/all-users",getallUsers);
router.get("/get-orders", authMiddleware, getOrders);
router.get("/getallorders", authMiddleware, isAdmin, getAllOrders);
router.get("/getorderbyuser/:id", authMiddleware, isAdmin, getOrderByUserId);
router.get("/refresh",handleRefreshToken);
router.get("/logout",logout);
router.get("/wishlist",authMiddleware, getWishList);
router.get("/cart",authMiddleware, getUsercart);


router.get("/:id",authMiddleware,isAdmin, getaUser);
router.delete("/delete-product-cart/:cartItemId",authMiddleware, removeProductFromCart);
router.delete("/empty-cart",authMiddleware, emptyCart);

router.delete("/:id",deleteUser);

router.put("/edit-user",authMiddleware,updateUser);
router.put("/save-address", authMiddleware, saveAddress);

router.put("/block-user/:id",authMiddleware,isAdmin,blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser);


module.exports = router;