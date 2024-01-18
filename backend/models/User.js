const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		canWrite: {
			type: Boolean,
			default: false,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		role: {
			type: String,
			default: "user",
			enum: ["user", "admin"],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
