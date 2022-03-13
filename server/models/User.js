const mongoose = require("mongoose");

// [bcrypt]
const bcrypt = require("bcrypt");
const saltRounds = 10;

// [JWT]
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
	name: { type: String, maxlength: 50 },
	email: { type: String, required:true, trim: true, unique: true },
	password: { type: String, required:true, minlength: 5 },
	role: { type: Number, required:true, default: 0 },
	image: { type: String },
	token: { type: String },
	tokenExp: { type: Number }
});

userSchema.pre("save", function (next) {
	const user = this;
	if (user.isModified('password')) {
		// 비밀번호를 암호화 시킨다.

		bcrypt.genSalt(saltRounds, function (err, salt) {
			if (err) { return next(err); }
			bcrypt.hash(user.password, salt, function (err, hash) {
				if (err) { return next(err); }
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
});

userSchema.methods.comparePassword = function(plainPW, callback) {
	bcrypt.compare(plainPW, this.password, function(err, isMatch) {
		if(err) {
			return callback(err);
		} else {
			return callback(null, isMatch)
		}
	});
}

userSchema.methods.generateToken = function (callback) {
	const user = this;
	user.token = jwt.sign(user._id.toHexString(), 'secretToken');
	user.save(function (err, user) {
		if (err) {
			return callback(err);
		} else {
			return callback(null, user);
		}
	});
}

userSchema.statics.findByToken = function(token, callback) {
	const user = this;

	jwt.verify(token, 'secretToken', function(err, decoded) {
		// 유저 아이디를 이용해서 유저를 찾은 후,
		// 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

		user.findOne({
			"_id": decoded,
			"token": token,
		}, function(err, user) {
			if (err) return callback(err);
			else return callback(null, user);
		});
	});
}

const User = mongoose.model('User', userSchema);
module.exports = {User}