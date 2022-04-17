const { User } = require("../models/User");

const auth = (req, res, next) => {
	// 인증처리 하는 곳
	// 클라이언트 쿠키에서 토큰을 가져온다.
	const token = req.cookies.x_auth;
	console.log(":: login user token : ", token);

	// 토큰을 복호화 한 후 유저를 찾는다.
	User.findByToken(token, (err, user) => {
		if (err) throw err;

		// 유저가 있으면 인증 O / 유저가 없으면 X
	console.log(":: login user : ", user.name, user.email);
		if (!user) {
			return res.json({
				isAuth: false,
				error: true
			});
		}

		req.token = token;
		req.user = user;
		next();
	});
}

module.exports = { auth };