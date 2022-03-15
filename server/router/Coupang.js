const router = require('express').Router();
const { getDeeplink, getSearchRanking, getGoldbox } = require('../api/coupangApi');

router.post("/deeplink", async (req, res) => {
	const url = {
		"coupangUrls": [req.body.url]
	};

	const data = await getDeeplink(url);
	return res.status(200).json({ success: true, links: data });
});
// deeplink 여러개 받는 것도 만들어야 할듯

router.get("/search", async (req, res) => {
	const keyword = req.query.keyword;

	const data = await getSearchRanking(keyword);
	return res.status(200).json({ success: true, rank: data });
});

router.get("/goldbox", async (req, res) => {
	const data = await getGoldbox();
	return res.status(200).json({ success: true, goldbox: data });
});

module.exports = router;
