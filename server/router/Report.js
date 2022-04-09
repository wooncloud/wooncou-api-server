const router = require('express').Router();
const { Report } = require("../models/Report");

router.get("/report",  (req, res) => {
	const page = +(req.query.page ?? 1);
	const count = +(req.query.count ?? 20);

	Report.find((err, data) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true, reports: data });
		}
	})
	.sort([['complete_date', 1], ['report_date', 1]])
	.limit(count)
	.skip((count * (page - 1)))
	// sort 순서 : 완료 여부, 최근 리포트
});

// 리포트 보기
router.get("/report/:id",  (req, res) => {
	const filter = { _id: req.params.id }

	Report.findById(filter,(err, data) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true, report: data });
		}
	});
});

// 리포트 쓰기
router.post("/report", (req, res) => {
	const report = new Report(req.body);
	report.save((err) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true });
		}
	});
});

// 리포트 처리 완료 설정
router.put("/report", (req, res) => {
	const filter = { _id: req.body.id };
	const update = { complete_date: Date.now() };

	Report.findByIdAndUpdate(filter, update, (err, data) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true, date: update.complete_date });
		}
	});
});

module.exports = router;
