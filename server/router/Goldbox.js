const router = require('express').Router();
const { Goldbox } = require("../models/Goldbox");

// 골드박스
router.get("/list",  (req, res) => {
	const count = +(req.query.count ?? 30);

	Goldbox.find((err, data) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true, goldbox: data });
		}
	}).sort([['rank', 1]])
	.limit(count);
});

module.exports = router;
