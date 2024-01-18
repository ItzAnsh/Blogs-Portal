const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const verifyToken = require("../verifyToken");
const Requests = require("../models/Requests");
const mongoose = require("mongoose");

//UPDATE
router.put("/:id", verifyToken, async (req, res) => {
	try {
		if (req.body.password) {
			const salt = await bcrypt.genSalt(10);
			req.body.password = await bcrypt.hashSync(req.body.password, salt);
		}
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{ new: true }
		);
		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(500).json(err);
	}
});

//DELETE
router.delete("/:id", verifyToken, async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id);
		await Post.deleteMany({ userId: req.params.id });
		await Comment.deleteMany({ userId: req.params.id });
		res.status(200).json("User has been deleted!");
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET USER
router.get("/:id", async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, ...info } = user._doc;
		res.status(200).json(info);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.post("/applyToWrite", verifyToken, async (req, res) => {
	console.log("reached");
	try {
		const found = await Requests.findOne({
			userId: new mongoose.Types.ObjectId(req.userId),
		});
		if (found) {
			return res.status(403).json("You have already applied!");
		}
		const newRequest = new Requests({
			userId: req.userId,
		});
		const savedRequest = await newRequest.save();
		res.status(200).json(savedRequest);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

module.exports = router;
