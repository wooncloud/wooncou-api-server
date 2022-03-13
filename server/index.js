const express = require('express')
const app = express()
const port = 5000
const config = require('./config/key');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const { User } = require("./models/User");
const { Post } = require("./models/Post");
const { Tag } = require("./models/Tags");
const { Report } = require("./models/Report");
const { auth } = require("./middleware/auth");

// [bodyParser Setting]
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

// [mongoose]
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
	useNewUrlParser:true,
	useUnifiedTopology:true,
	useCreateIndex:true,
	useFindAndModify:false
}).then(() => console.log("Mongo DB connection..."))
.catch(err => console.log(err))


app.listen(port, () => console.log(`Wooncou app listening on port ${port}!`))

// ----------------------------------------------------------
app.get('/', (req, res) => {
	res.send('hello world!')
});

app.get('/api/hello', (req, res) => {
	res.send('안녕하세요.');
});

// ----- ADMIN -----

// admin login
app.put('/api/users/register', (req, res) => {
	const user = new User(req.body);

	user.save((err) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true });
		}
	});
});

app.post('/api/users/login', (req, res) => {
	// 요청한 이메일 찾기
	User.findOne({ email: req.body.email }, (err, user) => {
		if(!user) {
			return res.json({
				loginSuccess: false,
				message: "제공된 이메일에 해당하는 유저가 없습니다."
			})
		}

		// 요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
		user.comparePassword(req.body.password, (err, isMatch) => {
			if(!isMatch) {
				return res.json({
					loginSuccess: false,
					message: "비밀번호가 틀렸습니다."
				});
			}

			// 성공 // 비밀번호까지 맞다면 토큰을 생성하기
			user.generateToken((err, user) => {
				if (err) return res.status(400).send(err);

				// 토큰 저장
				res.cookie("x_auth", user.token)
					.status(200)
					.json({
						loginSuccess: true,
						userId: user._id
					});
			});
		});
	});
});

app.get("/api/users/auth", auth, (req, res) => {
	// 여기까지 미들웨어를 통과했다는 것은 Authentication이 true라는 뜻
	res.status(200).json({
		_id:req.user._id,
		isAdmin: req.user.role === 0 ? false : true,
		isAuth: true,
		name: req.user.name,
		email: req.user.email,
		lastname: req.user.lastname,
		role: req.user.role,
		image: req.user.image,
	});
});

app.get("/api/users/logout", auth, (req, res) => {
	User.findOneAndUpdate(
		{ _id: req.user._id },
		{ token: "" },
		(err, user) => {
			if (err) return res.json({ success: false, err });
			return res.status(200).send({
				success: true
			});
		})
});

// ----- POST -----

// 글 리스트 가져오기
app.get("/api/post-list",  (req, res) => {
	const search = req.query.search;

	if(!search) {
		// 일반 검색
		Post.find((err, data) => {
			if (err) {
				return res.json({ success: false, err });
			} else {
				return res.status(200).json({ success: true, posts: data });
			}
		}).sort([['date', -1]]) // 최근 글
		// .limit( 페이징 )
		// .sort( [[]] )
	} else {
		// LIKE 검색
		Post.find({title: {$regex: `.*${search}.*`, $options: "ig"}}, (err, data) => {
			if (err) {
				return res.json({ success: false, err });
			} else {
				return res.status(200).json({ success: true, posts: data });
			}
		}).sort([['date', -1]]) // 최근 글
	}
});

// 포스트 읽기
app.get("/api/post",  (req, res) => {
	const filter = { _id: req.body.id };

	Post.findOne(filter, (err, data) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true, posts: data });
		}
	})
});

// 포스트 쓰기
app.post("/api/post", (req, res) => {
	const postData = {
		title: req.body.title,
		author: req.body.author,
		content: req.body.content,
		tags: []
	}

	postData.tags = Tag.findAndInsertTag(req.body.tags, (err, tagArr) => {
		postData.tags = tagArr;
		const post = new Post(postData);
		post.save((err) => {
			if (err) {
				return res.json({ success: false, err });
			} else {
				return res.status(200).json({ success: true });
			}
		});
	});
});

// 포스트 삭제
app.delete("/api/post", (req, res) => {
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


// ----- Tag -----
// 태그 전체 가져오기
app.get("/api/tags",  (req, res) => {
	Tag.find((err, data) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true, tags: data });
		}
	}).sort([['tag_name', 1]]) // 태그 이름으로 sort
});


// ----- Report -----
app.get("/api/report",  (req, res) => {
	Report.find((err, data) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true, reports: data });
		}
	})
	.sort([['complete_date', 1], ['report_date', 1]])
	// sort 순서 : 완료 여부, 최근 리포트
});

// 리포트 보기
app.get("/api/report/:id",  (req, res) => {
	console.log(req.params);

	Report.findById(filter,(err, data) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true, report: data });
		}
	});
});

// 리포트 쓰기
app.post("/api/report", (req, res) => {
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
app.put("/api/report", (req, res) => {
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