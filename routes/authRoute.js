const express = require("express");
const {createUser,loginUserCtrl, getallUsers} = require("../controller/userCtrl");
const router = express.Router();

router.post("/register", createUser);
router.post("/login",loginUserCtrl);
router.get("/all-users",getallUsers);

module.exports = router;