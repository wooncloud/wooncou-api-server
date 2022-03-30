const { Schema } = require("mongoose");
const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now },
    title_image: { type: String, default: null },
    views: { type: Number, required: true, default: 0 },
    deleted: { type: String, required: true, default: 'N' },
    content: { type: String, required: true },
    temp: { type: Boolean, required: true, default: false },
    tags: [{ type: Map, of: { type: String }, ref: 'Tag' }],
});

const Post = mongoose.model('Post', postSchema);
module.exports = { Post }