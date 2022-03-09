const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
	title: { type: String, maxlength: 30, required: true },
	content: { type: String, maxlength: 200 },
	guest_name: { type: String, required: true },
	guest_email: { type: String, required: true },
});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = { Comment }