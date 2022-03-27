const router = require('express').Router();
const { Tag } = require("../models/Tags");

// 태그 전체 가져오기
router.get("/tags", (req, res) => {
	Tag.find((err, data) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true, tags: data });
		}
	}).sort([['tag_name', 1]]) // 태그 이름으로 sort
});

// 태그 쓰기
router.post("/tags", (req, res) => {
	const tag = new Tag({ tag_name: req.body.tag_name });

	Tag.findOne({ tag_name: req.body.tag_name }, (err, data) => {
		if(err) return res.json({ success: false, err });

		console.log(data);
		if (!data) {
			tag.save((err) => {
				if (err) {
					return res.json({ success: false, err })
				} else {
					return res.status(200).json({ success: true });
				}
			});
		} else {
			return res.status(200).json({ success: true, message: "이미 있는 태그 입니다." });
		}
	});
});

// 태그 삭제
router.delete("/tags", (req, res) => {
	const filter = { _id: req.query.id };

	Tag.deleteOne(filter, err => {
		if (err) {
			return res.json({ success: false, err })
		} else {
			return res.status(200).json({ success: true });
		}
	})
});


module.exports = router;
