const express = require("express");
const router = express.Router();
const User = require("../models/User");
// const Tokens = require("../models/Tokens");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const sendMail = require("../utils/sendMail");
dotenv.config();

//REGISTER
router.post("/register", async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hashSync(password, salt);
		const newUser = new User({ username, email, password: hashedPassword });
		const token = jwt.sign({ email: email }, process.env.SECRET, {
			expiresIn: "1h",
		});
		console.log(token);
		const savedUser = await newUser.save();

		// const newToken = new Tokens({
		// 	userId: savedUser._id,
		// 	token: token,
		// });

		sendMail({
			email: email,
			subject: "Verification Email",
			message: `
		<h1>Verify your email</h1>
		<p>Click the link below to verify your email</p>
		<a href="http://localhost:${process.env.PORT}/api/auth/verify/${token}">Verify your email</a>
		`,
		});
		res.status(200).json(savedUser);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

//LOGIN
router.post("/login", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		console.log(user);

		if (!user) {
			return res.status(404).json("User not found!");
		}

		if (!user.isVerified) {
			return res.status(401).json("Please verify your email!");
		}
		const match = await bcrypt.compare(req.body.password, user.password);

		if (!match) {
			return res.status(401).json("Wrong credentials!");
		}
		const token = jwt.sign(
			{ _id: user._id, username: user.username, email: user.email },
			process.env.SECRET,
			{ expiresIn: "3d" }
		);
		const { password, ...info } = user._doc;
		res.cookie("token", token).status(200).json(info);
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

//LOGOUT
router.get("/logout", async (req, res) => {
	try {
		res
			.clearCookie("token", { sameSite: "none", secure: true })
			.status(200)
			.send("User logged out successfully!");
	} catch (err) {
		res.status(500).json(err);
	}
});

//REFETCH USER
router.get("/refetch", (req, res) => {
	const token = req.cookies.token;
	jwt.verify(token, process.env.SECRET, {}, async (err, data) => {
		if (err) {
			return res.status(404).json(err);
		}
		res.status(200).json(data);
	});
});

// VERIFY USER
router.get("/verify/:token", async (req, res) => {
	try {
		const token = req.params.token;
		const verified = jwt.verify(token, process.env.SECRET, {});
		const user = await User.findOne({ email: verified.email });
		if (!user) {
			return res.status(404).json("User not found!");
		}
		await User.findByIdAndUpdate(user._id, { isVerified: true });
		res.status(200).json("User has been verified!");
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

module.exports = router;
