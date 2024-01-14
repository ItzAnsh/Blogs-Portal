const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const BlogDetailsSchema = new Schema({
	title: {
		type: String,
		required: true,
	},
	subtitle: {
		type: String,
		required: true,
	},
	authorId: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	content: String,
	tags: {
		type: [String],
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
	shareCount: {
		type: Number,
		default: 0,
	},
});

const BlogDetails = mongoose.model("BlogDetails", BlogDetailsSchema);

module.exports = BlogDetails;
