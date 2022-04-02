const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const goldboxSchema = mongoose.Schema({
	productId: { type: Number },
	productName: { type: String },
	productPrice: { type: Number },
	productImage: { type: String },
	productUrl: { type: String },
	rank: {type: Number},
	isRocket: { type: Boolean },
	isFreeShipping: { type: Boolean },
});

const Goldbox = mongoose.model("Goldbox", goldboxSchema);
module.exports = { Goldbox }