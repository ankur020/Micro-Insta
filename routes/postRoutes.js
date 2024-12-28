const express = require("express");
const multer = require("multer");
const {
  getAllPosts,
  createPost,
  getPostsByUser,
  editPost,
  deletePost,
} = require("../controllers/postController");

const upload = multer();
const router = express.Router();

router.get("/get", getAllPosts);
router.get("/get/:userId", getPostsByUser);
router.post("/create", upload.array("images", 10), createPost);
router.put("/update/:postId", editPost);
router.delete("/delete/:postId", deletePost);

module.exports = router;
