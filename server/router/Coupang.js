const router = require('express').Router();
const { getDeeplink, getSearchRanking, getGoldbox } = require('../api/coupangApi');

router.post("/deeplink", async (req, res) => {
	const url = {
		"coupangUrls": [req.body.url]
	};

		let data = await getDeeplink(url);
		if (!data) {
			err = { success: false, message: "검색 결과가 없습니다." }
			return res.status(200).json(err);
		} else {
			return res.status(200).json({ success: true, data: data });
		}
});
// deeplink 여러개 받는 것도 만들어야 할듯

router.get("/search", async (req, res) => {
	const keyword = req.query.keyword;

	const data = await getSearchRanking(keyword);
	if (!data) {
		err = { success: false, message: "검색 결과가 없습니다." }
		return res.status(200).json(err);
	} else {
		return res.status(200).json({ success: true, data: data });
	}
});

router.get("/goldbox", async (req, res) => {
	const data = await getGoldbox();
	if (!data) {
		err = { success: false, message: "검색 결과가 없습니다." }
		return res.status(200).json(err);
	} else {
		return res.status(200).json({ success: true, data: data });
	}
});

module.exports = router;
