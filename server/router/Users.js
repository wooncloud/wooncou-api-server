const router = require('express').Router();
const { auth } = require("../middleware/auth");
const { User } = require("../models/User");

router.put('/register', (req, res) => {
	const user = new User(req.body);

	user.save((err) => {
		if (err) {
			return res.json({ success: false, err });
		} else {
			return res.status(200).json({ success: true });
		}
	});
});

router.post('/login', (req, res) => {
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
						userId: user._id,
						userName: user.name
					});
			});
		});
	});
});

router.get("/auth", auth, (req, res) => {
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

router.get("/logout", auth, (req, res) => {
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


module.exports = router;
