const router = require('express').Router();
const { Goldbox } = require('../models/Goldbox');
const { Post } = require('../models/Post');

router.get("/main", async (req, res) => {
	const recommendCount = 4;
	const goldboxCount = 6;
	const mostViewCount = 3;
	const latestCount = 5;
	
	const mainData = {
		recommend: null,
		goldbox: null,
		mostView: null,
		latest: null,
	}
	const commonFilter = { temp: false, deleted: "N" };

	// 추천 글


	// 골드 박스
	await Goldbox.find((err, data) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			mainData.goldbox = data;
		}
	}).sort([['rank', 1]])
	.limit(goldboxCount);

	// 최다 뷰
	await Post.find(commonFilter, (err, data) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			mainData.mostView = data;
		}
	}).sort([['views', -1]])
	.limit(mostViewCount)

	// 최근 글
	await Post.find(commonFilter, (err, data) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			mainData.latest = data;
		}
	}).sort([['date', -1]]) // 최근 글
	.limit(latestCount)

	return res.status(200).json({ success: true, main: mainData });
});

module.exports = router;
