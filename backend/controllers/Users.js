const express = require("express");
const app = express();
const mongoose = require("mongoose");

const User = require("../_models/UserDetails.model");
const Blog = require("../_models/BlogDetails.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const RegisterUser = async (req, res) => {
	let { username, email, password, passwordCheck } = req.body;

	// Validation
	if (!username || !email || !password || !passwordCheck)
		return res.status(400).send({ msg: "Please enter all fields" });
	if (password.length < 6)
		return res
			.status(400)
			.send({ msg: "Password must be atleast 6 characters long" });
	if (password !== passwordCheck)
		return res.status(400).send({ msg: "Passwords do not match" });

	// Check if user already exists
	const ExistingUser = await User.findOne({ email: email });
	// console.log(ExistingUser);
	if (ExistingUser) return res.status(400).send({ msg: "User already exists" });

	// Hash password
	bcrypt.hash(password, 10).then((hashedPassword) => {
		const newUser = new User({
			username,
			email,
			password: hashedPassword,
		});

		newUser.save().then((savedUser) => {
			res.json(savedUser);
		});
	});
};

const LoginUser = async (req, res) => {
	let { email, password } = req.body;
	// console.log(email, password);

	if (!email || !password)
		return res.status(400).send({ msg: "Please enter all fields" });

	const ActualUser = await User.findOne({ email: email });
	// If user not found send error message
	if (!ActualUser) return res.status(400).send({ msg: "User does not exist" });

	// Validate password
	bcrypt.compare(password, ActualUser.password).then((isMatch) => {
		if (!isMatch) return res.status(400).send({ msg: "Invalid credentials" });

		jwt.sign(
			{ id: ActualUser.id },
			process.env.JWT_SECRET,
			{ expiresIn: 3600 },
			(err, token) => {
				if (err) throw err;
				res.json({
					token,
					user: {
						id: ActualUser.id,
						username: ActualUser.username,
						email: ActualUser.email,
					},
				});
			}
		);
	});
};

const UserDetails = async (req, res) => {
	const data = await User.findById(req.user.id)
		.select("-password")
		.then((user) => res.json(user));

	res.json(data);
};

const findUserDetails = async (req, res) => {
	const data = await User.findById(req.params.id)
		.select("-password")
		.then((user) => res.json(user));

	res.json(data);
};

module.exports = { RegisterUser, LoginUser, UserDetails, findUserDetails };
