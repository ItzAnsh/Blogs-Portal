const express = require("express");
const app = express();
const router = express.Router();
const JWTDecoder = require("../middlewares/JWTDecoder");

const { findUserBlogs, CreateBlogPost } = require("../controllers/UserBlogs");

router.use(JWTDecoder);

router.post("/createBlog", CreateBlogPost);

router.post("/:id", findUserBlogs);

module.exports = router;
