const express = require("express");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createBlog,updateBlog, getBlog, getAllBlog, deleteBlog, likeBlog } = require("../controller/blogCtrl");
const router = express.Router();

router.post("/", authMiddleware,isAdmin,createBlog);
router.put("/likes",authMiddleware,likeBlog);
router.put("/:id", authMiddleware,isAdmin,updateBlog);
router.get("/:id",getBlog);
router.get("/",getAllBlog);
router.delete("/:id",authMiddleware,isAdmin,deleteBlog);


module.exports = router;