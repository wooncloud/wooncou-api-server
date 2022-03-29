const router = require('express').Router();
const { Post } = require("../models/Post");

// 포스트 읽기
router.get("/post",  (req, res) => {
	const filter = {
		_id: req.query.id, 
		search: req.query.search 
	};

	if(filter._id) { // detail
		Post.findOne(filter, (err, data) => {
			if (err) {
				return res.json({ success: false, err });
			} else {
				return res.status(200).json({ success: true, posts: data });
			}
		})
	} else if (filter.search) { // 리스트 like 검색
		Post.find({title: {$regex: `.*${filter.search}.*`, $options: "ig"}}, (err, data) => {
			if (err) {
				return res.json({ success: false, err });
			} else {
				return res.status(200).json({ success: true, posts: data });
			}
		}).sort([['date', -1]]) // 최근 글
	} else { // 전체 리스트
		Post.find((err, data) => {
			if (err) {
				return res.json({ success: false, err });
			} else {
				return res.status(200).json({ success: true, posts: data });
			}
		}).sort([['date', -1]]) // 최근 글
		// .limit( 페이징 )
		// .sort( [[]] )
	}
});

// 포스트 쓰기
router.post("/post", (req, res) => {
	const postData = {
		title: req.body.title,
		author: req.body.author,
		content: req.body.content,
		tags: req.body.tags,
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

// 임시저장 put
router.put("/post", (req, res) => {
	const filter = { _id: req.body._id };
	const update = {
		title: req.body.title,
		content: req.body.content,
		tags: req.body.tags,
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
