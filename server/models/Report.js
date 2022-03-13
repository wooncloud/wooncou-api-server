const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
	title: { type: String, required: true, maxlength: 30 },
	content: { type: String, required: true, maxlength: 200 },
	user_name: { type: String, required: true },
	user_email: { type: String, required: true },
	report_date: { type: Date, required: true, default: Date.now() },
	complete_date: { type: Date, default: null }
});

const Report = mongoose.model('Report', reportSchema);
module.exports = { Report }