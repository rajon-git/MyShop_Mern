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
    createOrder,
    removeProductFromCart,
    updateQuantityFromCart,
    getMyOrders,
    getMonthWiseOrderIncome,
    getAllOrders,
    getYearlyTotalIncome,
    getSingleOrder,
    updateOrder,
    applyCoupon,
    emptyCart,
    deleteCoupon
} = require("../controller/userCtrl");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const { checkout, paymentVerification } = require("../controller/paymentCtrl");
const router = express.Router();

router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);

router.put("/reset-password/:token", resetPassword);
// router.put("/order/update-order/:id",authMiddleware,isAdmin, updateOrderStatus);

router.put("/password",authMiddleware, updatePassword);
router.post("/login",loginUserCtrl);
router.post("/admin-login",loginAdmin);
router.post("/cart",authMiddleware, userCart);
router.post("/order/checkout",authMiddleware, checkout);
router.post("/order/paymentVerification",authMiddleware, paymentVerification);
router.post("/cart/applycoupon",authMiddleware, applyCoupon);
router.post("/cart/cash-order",authMiddleware, createOrder);

router.get("/all-users",getallUsers);
router.get("/getmyorders", authMiddleware, getMyOrders);
router.get("/getallorders", authMiddleware, isAdmin, getAllOrders);
router.get("/getaOrder/:id", authMiddleware, isAdmin, getSingleOrder);
router.put("/updateorder/:id", authMiddleware, isAdmin, updateOrder);
// router.get("/getorderbyuser/:id", authMiddleware, isAdmin, getOrderByUserId);
router.get("/refresh",handleRefreshToken);
router.get("/logout",logout);
router.get("/wishlist",authMiddleware, getWishList);
router.get("/cart",authMiddleware, getUsercart);  
router.get("/getMonthWiseOrderIncome",authMiddleware,isAdmin, getMonthWiseOrderIncome);
router.get("/getYearlyTotalIncome",authMiddleware,isAdmin, getYearlyTotalIncome);


router.get("/:id",authMiddleware,isAdmin, getaUser);
router.delete("/delete-product-cart/:cartItemId",authMiddleware, removeProductFromCart);
router.delete("/update-product-cart/:cartItemId/:newQuantity",authMiddleware, updateQuantityFromCart);
// router.delete("/empty-cart",authMiddleware, emptyCart);

router.delete("/coupon/:couponId", deleteCoupon);
router.delete("/empty",authMiddleware,emptyCart);
router.delete("/:id",deleteUser);

router.put("/edit-user",authMiddleware,updateUser);
router.put("/save-address", authMiddleware, saveAddress);

router.put("/block-user/:id",authMiddleware,isAdmin,blockUser);
router.put("/unblock-user/:id",authMiddleware,isAdmin,unblockUser);


module.exports = router;