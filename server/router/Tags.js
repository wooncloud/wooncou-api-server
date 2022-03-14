const router = require('express').Router();
const { Tag } = require("../models/Tags");

// 태그 전체 가져오기
router.get("/tags",  (req, res) => {
	Tag.find((err, data) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true, tags: data });
		}
	}).sort([['tag_name', 1]]) // 태그 이름으로 sort
});



module.exports = router;
