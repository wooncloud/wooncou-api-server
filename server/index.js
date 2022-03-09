const express = require('express')
const app = express()
const port = 5000
const config = require('./config/key');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const { User } = require("./models/User");
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


app.listen(port, () => console.log(`example app listening on port ${port}!`))

// ----------------------------------------------------------
app.get('/', (req, res) => {
	res.send('hello world!')
	console.log(req.cookies.x_auth);
});

app.get('/api/hello', (req, res) => {
	res.send('안녕하세요.');
});


// admin login
app.put('/api/users/register', (req, res) => {
	const user = new User(req.body);

	user.save((err, userInfo) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true });
		}
	});
});

app.post('/api/users/login', (req, res) => {
	console.log(req);
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