const router = require('express').Router();
const { Post } = require("../models/Post");

// 포스트 읽기
router.get("/post",  (req, res) => {
	const page = +(req.query.page ?? 1);
	const count = +(req.query.count ?? 20);
	const filter = { temp: false, deleted: "N" };

	if(req.query.id) { // detail
		filter._id = req.query.id;
		Post.findOne(filter, (err, data) => {
			if (err) {
				return res.json({ success: false, err });
			} else {
				return res.status(200).json({ success: true, posts: data });
			}
		})
	} else if (req.query.search) { // 리스트 like 검색
		filter.title = {$regex: `.*${filter.search}.*`, $options: "ig"};
		Post.find(filter, (err, data) => {
			if (err) {
				return res.json({ success: false, err });
			} else {
				return res.status(200).json({ success: true, posts: data });
			}
		}).sort([['date', -1]]) // 최근 글
		.limit(count)
		.skip((count * (page - 1)))
	} else { // 전체 리스트
		Post.find(filter, (err, data) => {
			if (err) {
				return res.json({ success: false, err });
			} else {
				return res.status(200).json({ success: true, posts: data });
			}
		}).sort([['date', -1]]) // 최근 글
		.limit(count)
		.skip((count * (page - 1)))
	}
});

router.get("/admin/post",  (req, res) => {
	const page = +(req.query.page ?? 1);
	const count = +(req.query.count ?? 20);
	const filter = { };

	if(req.query.id) { // detail
		filter._id = req.query.id;
		Post.findOne(filter, (err, data) => {
			if (err) {
				return res.json({ success: false, err });
			} else {
				return res.status(200).json({ success: true, posts: data });
			}
		})
	} else if (req.query.search) { // 리스트 like 검색
		filter.title = {$regex: `.*${filter.search}.*`, $options: "ig"};
		Post.find(filter, (err, data) => {
			if (err) {
				return res.json({ success: false, err });
			} else {
				return res.status(200).json({ success: true, posts: data });
			}
		}).sort([['date', -1]]) // 최근 글
		.limit(count)
		.skip((count * (page - 1)))
	} else { // 전체 리스트
		Post.find(filter, (err, data) => {
			if (err) {
				return res.json({ success: false, err });
			} else {
				return res.status(200).json({ success: true, posts: data });
			}
		}).sort([['date', -1]]) // 최근 글
		.limit(count)
		.skip((count * (page - 1)))
	}
});

/**
 * 최근 글 보기
 */
router.get("/post/latest",  (req, res) => {
	const page = +(req.query.page ?? 1);
	const count = +(req.query.count ?? 20);
	const filter = { temp: false, deleted: "N" };

	Post.find(filter, (err, data) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true, posts: data });
		}
	}).sort([['date', -1]]) // 최근 글
	.limit(count)
	.skip((count * (page - 1)))
});

/**
 * 최다 뷰 보기
 */
router.get("/post/most-view",  (req, res) => {
	const page = +(req.query.page ?? 1);
	const count = +(req.query.count ?? 20);
	const filter = { temp: false, deleted: "N" };

	Post.find(filter, (err, data) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true, posts: data });
		}
	}).sort([['views', -1]]) // 최근 글
	.limit(count)
	.skip((count * (page - 1)))
});

/**
 * 추천 픽
 */

// 포스트 쓰기
router.post("/post", (req, res) => {
	const postData = {
		title: req.body.title,
		author: req.body.author,
		content: req.body.content,
		title_image: req.body.title_image,
		tags: req.body.tags,
		temp: false,
	}

	const post = new Post(postData);
	post.save((err) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true });
		}
	});
});

// 포스트 수정
router.put("/post", (req, res) => {
	const filter = { _id: req.body._id };
	const update = {
		title: req.body.title,
		content: req.body.content,
		title_image: req.body.title_image,
		tags: req.body.tags,
		temp: false,
	};

	Post.findByIdAndUpdate(filter, update, (err, data) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true, data: data });
		}
	});
});

// 임시저장 post
router.post("/post/temp", (req, res) => {
	const postData = {
		title: req.body.title,
		author: req.body.author,
		content: req.body.content,
		title_image: req.body.title_image,
		tags: req.body.tags,
		temp: true,
	}

	const post = new Post(postData);
	post.save((err, data) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true, data: data });
		}
	});
});

// 임시저장 put
router.put("/post/temp", (req, res) => {
	const filter = { _id: req.body._id };
	const update = {
		title: req.body.title,
		content: req.body.content,
		title_image: req.body.title_image,
		tags: req.body.tags,
		temp: true,
	};

	Post.findByIdAndUpdate(filter, update, (err, data) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true, data: data });
		}
	});
});

// 포스트 삭제
router.delete("/post", (req, res) => {
	const filter = { _id: req.body.id };
	const update = { deleted: req.body.deleted };

	Post.findByIdAndUpdate(filter, update, (err, data) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true });
		}
	});
});

module.exports = router;
