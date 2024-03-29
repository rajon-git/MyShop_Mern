const express = require("express");
const { deleteImges,uploadImges } = require("../controller/uploadCtrl");
const { isAdmin,authMiddleware } = require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages");
const router = express.Router();

router.post("/",authMiddleware,isAdmin, uploadPhoto.array('images', 10), productImgResize, uploadImges);
router.delete("/delete-img/:id",authMiddleware,isAdmin, deleteImges);

module.exports = router;