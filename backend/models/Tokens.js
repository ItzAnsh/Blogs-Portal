const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "users",
	},
	token: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		// 1 day
		default: Date.now,
		expires: 86400,
	},
});

module.exports = mongoose.model("tokens", TokenSchema);
