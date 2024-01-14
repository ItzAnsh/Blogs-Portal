const express = require("express");
const router = express.Router();

const {
  CreateBlogPost,
  GetAllBlogPosts,
  GetBlogPostById,
  UpdateBlogPost,
  DeleteBlogPost,
} = require("../controllers/Blog");

router.post("/blog", CreateBlogPost); 

router.get("/blogs", GetAllBlogPosts); 

router.get("/blog/:id", GetBlogPostById); 

router.put("/blog/:id", UpdateBlogPost); 

router.delete("/blog/:id", DeleteBlogPost); 

module.exports = router;
