const express = require("express");
const {createUser,loginUserCtrl, getallUsers, getaUser, deleteUser,updateUser} = require("../controller/userCtrl");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", createUser);
router.post("/login",loginUserCtrl);
router.get("/all-users",getallUsers);
router.get("/:id",authMiddleware,isAdmin, getaUser);
router.delete("/:id",deleteUser);
router.put("/:id",authMiddleware,updateUser);

module.exports = router;