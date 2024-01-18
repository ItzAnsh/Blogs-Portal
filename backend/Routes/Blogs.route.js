const express = require("express");
const router = express.Router();
const JWTDecoder = require("../middlewares/JWTDecoder");
const app = express();

const {
	GetAllBlogPosts,
	GetBlogPostById,
	UpdateBlogPost,
	DeleteBlogPost,
} = require("../controllers/Blogs");

app.all("*", JWTDecoder);

router.get("/blogs", GetAllBlogPosts);

router.get("/blog/:id", GetBlogPostById);

router.put("/blog/:id", UpdateBlogPost);

router.delete("/blog/:id", DeleteBlogPost);

module.exports = router;
