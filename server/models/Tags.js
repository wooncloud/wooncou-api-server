const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
	tag_name: { type: String, required: true },
});

tagSchema.statics.findAndInsertTag = async function(tags, callback) {

	const tagArr = [];

	for (const tag of tags) {
		await Tag.findOne({ tag_name: tag.tag_name }, (err, data) => {
			if (err) { return callback(err); }

			if (data === null) {
				const newTag = new Tag({ tag_name: tag });
				newTag.save((err, data) => {
					if (err) { return callback(err); }
					tagArr.push(data._id);
				});
			} else {
				tagArr.push(data._id);
			}
		})
	}

	return callback(null, tagArr);
}


const Tag = mongoose.model('Tag', tagSchema);
module.exports = { Tag }
