const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    post_id: { type: Number, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    date: { type: Date, required: true, default: Date.now() },
    title_image: { type: String, default: null },
    views: { type: Number, required: true, default: 0 },
    deleted: { type: String, required: true, default: 'N' },
    content: { type: String, required: true },
});

postSchema.methods.getPostList = function (callback) {
    const post = this;


}

postSchema.methods.getDetailPost = function (callback) {

}

postSchema.methods.addPost = function (callback) {
    
}

postSchema.methods.editPost = function (callback) {

}

postSchema.methods.deletePost = function (callback) {

}


const Post = mongoose.model('Post', postSchema);
module.exports = {Post}