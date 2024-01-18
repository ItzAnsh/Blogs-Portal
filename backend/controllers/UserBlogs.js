const mongoose = require("mongoose");
const Blog = require("../_models/BlogDetails.model");
const User = require("../_models/UserDetails.model");

//create
const CreateBlogPost = async (req, res) => {
	try {
		const { title, subtitle, content, tags, shareCount } = req.body;
		const { id: authorId } = req.user;
		// console.log(req.user);
		const newBlogPost = new BlogDetails({
			title,
			subtitle,
			authorId,
			content,
			tags,
			shareCount,
		});
		const savedBlogPost = await newBlogPost.save();
		res.status(201).json(savedBlogPost);
	} catch (error) {
		res.status(500).json({
			message: "Failed to create a new blog post",
			error: error.message,
		});
	}
};

// find a specific user blogs
const findUserBlogs = async (req, res) => {
	try {
		const { id } = req.params;

		const data = await Blog.find(
			{
				authorId: new mongoose.Types.ObjectId(id),
				isVr: true,
			},
			{
				_id: 1,
				title: 1,
				subtitle: 1,
				tags: 1,
				date: 1,
			}
		).populate("authorId", {
			_id: 1,
		});

		// console.log(data.length);

		if (data.length === 0) {
			return res.status(404).json({ error: "err" });
		}
		return res.status(200).json(data);
	} catch (e) {
		console.log(e);
		return res.status(400).json(e.message);
	}
};

module.exports = { findUserBlogs, CreateBlogPost };
