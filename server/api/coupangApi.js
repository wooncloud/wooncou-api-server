const axios = require('axios');
const { generateHmac } = require('./hmacGenerator');
const keys = require('../config/coupang');

const REQUEST_METHOD = "POST";
const DOMAIN = "https://api-gateway.coupang.com";
const URL = "/v2/providers/affiliate_open_api/apis/openapi/v1/deeplink";

// Replace with your own ACCESS_KEY and SECRET_KEY
const ACCESS_KEY = keys.ACCESS_KEY;
const SECRET_KEY = keys.SECRET_KEY;

// example
const REQUEST = {
	"coupangUrls": [
		"https://www.coupang.com/np/search?component=&q=good&channel=user",
		"https://www.coupang.com/np/coupangglobal"
	]
};

// 이부분 module.exports
(async () => {
	const authorization = generateHmac(REQUEST_METHOD, URL, SECRET_KEY, ACCESS_KEY);
	axios.defaults.baseURL = DOMAIN;

	try {
		const response = await axios.request({
			method: REQUEST_METHOD,
			url: URL,
			headers: { Authorization: authorization },
			data: REQUEST
		});
		console.log(response.data);
	} catch (err) {
		console.error(err.response.data);
	}
})();

module.exports = ""; // 연결하기