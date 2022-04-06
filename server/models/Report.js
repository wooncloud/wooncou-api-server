const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
	title: { type: String, required: true, maxlength: 100 },
	content: { type: String, required: true, maxlength: 2000 },
	user_name: { type: String, required: true, maxlength: 20},
	user_email: { type: String, required: true, maxlength: 100},
	report_date: { type: Date, required: true, default: Date.now() },
	complete_date: { type: Date, default: null }
});

const Report = mongoose.model('Report', reportSchema);
module.exports = { Report }