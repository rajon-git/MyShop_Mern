const express = require("express");
const {createUser,loginUserCtrl, getallUsers, getaUser, deleteUser,updateUser} = require("../controller/userCtrl");
const router = express.Router();

router.post("/register", createUser);
router.post("/login",loginUserCtrl);
router.get("/all-users",getallUsers);
router.get("/:id",getaUser);
router.delete("/:id",deleteUser);
router.put("/:id",updateUser);

module.exports = router;