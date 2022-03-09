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
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }]
});

const Post = mongoose.model('Post', postSchema);
module.exports = { Post }