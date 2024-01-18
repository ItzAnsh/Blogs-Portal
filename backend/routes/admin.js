const express = require("express");
const router = express.Router();
const verifyToken = require("../verifyToken");
const Posts = require("../models/Post");
const Users = require("../models/User");
const Requests = require("../models/Requests");
const mongoose = require("mongoose");

router.use(verifyToken);

const verifyAdmin = async (req, res, next) => {
	// console.log(req.user);
	const user = await Users.findOne({
		_id: new mongoose.Types.ObjectId(req.userId),
	});
	if (user.role !== "admin") {
		return res.status(403).json("You are not authorized!");
	}
	next();
};

router.use(verifyAdmin);

router.get("/", async (req, res) => {
	try {
		const posts = await Posts.find();

		const users = await Users.find();
		res.json({ posts, users });
	} catch (err) {
		res.json({ message: err });
	}
});

router.delete("/deletePost/:post", async (req, res) => {
	try {
		await Posts.findByIdAndDelete(req.params.post);
		res.json({ message: "Post deleted successfully" });
	} catch (err) {
		res.json({ message: err });
	}
});

router.delete("/deleteUser/:user", async (req, res) => {
	try {
		await Users.findByIdAndDelete(req.params.user);
		res.json({ message: "User deleted successfully" });
	} catch (err) {
		res.json({ message: err });
	}
});

router.get("/requests", async (req, res) => {
	try {
		const requests = await Requests.find();
		res.json(requests);
	} catch (err) {
		res.json({ message: err });
	}
});

router.post("/acceptRequest/:request", async (req, res) => {
	try {
		const request = await Requests.findById(req.params.request);
		const user = await Users.findById(request.userId);
		user.canWrite = true;
		await user.save();
		// await Requests.findByIdAndDelete(req.params.request);
		await Requests.updateOne(
			{ _id: new mongoose.Types.ObjectId(req.params.request) },
			{ status: "accepted" }
		);
		res.json({ message: "Request accepted successfully" });
	} catch (err) {
		res.json({ message: err });
	}
});

router.post("/rejectRequest/:request", async (req, res) => {
	try {
		const Request = await Requests.findOne({
			_id: new mongoose.Types.ObjectId(req.params.request),
		});

		if (!Request) {
			return res.status(404).json({ message: "Request not found" });
		}

		await Requests.updateOne(
			{ _id: new mongoose.Types.ObjectId(req.params.request) },
			{ status: "rejected" }
		);

		await Requests.findByIdAndDelete(req.params.request);
		res.status(200).json({ message: "Request rejected successfully" });
	} catch (err) {
		res.json({ message: err });
	}
});

module.exports = router;
