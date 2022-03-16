const axios = require('axios');
const { generateHmac } = require('./hmacGenerator');
const { ACCESS_KEY, SECRET_KEY } = require('../config/coupang');

const DOMAIN = "https://api-gateway.coupang.com";
const BASE_URL = "/v2/providers/affiliate_open_api/apis/openapi";

/**
 * 딥 링크 가져오기
 * @param {*} value json object
 */
const getDeeplink = async (value) => {
	const REQUEST_METHOD = "POST";
	const URL = BASE_URL + "/deeplink"

	const authorization = generateHmac(REQUEST_METHOD, URL, SECRET_KEY, ACCESS_KEY);
	axios.defaults.baseURL = DOMAIN;

	try {
		const response = await axios.request({
			method: REQUEST_METHOD,
			url: URL,
			headers: { Authorization: authorization },
			data: value
		});
		return response.data;
	} catch (err) {
		return err.response.data;
	}
}

/**
 * 검색한 내용으로 랭킹 뽑기
 * @param {*} keyword 검색 키워드
 * @returns 
 */
const getSearchRanking = async (keyword) => {
	const REQUEST_METHOD = "GET";
	const URL = `${BASE_URL}/products/search?keyword=${encodeURIComponent(keyword)}`;

	const authorization = generateHmac(REQUEST_METHOD, URL, SECRET_KEY, ACCESS_KEY);
	axios.defaults.baseURL = DOMAIN;

	try {
		const response = await axios.request({
			method: REQUEST_METHOD,
			url: URL,
			headers: { Authorization: authorization }
		});
		return response.data;
	} catch (err) {
		return err.response.data;
	}
}

/**
 * 골드박스 가져오기
 * @returns 
 */
const getGoldbox = async () => {
	const REQUEST_METHOD = "GET";
	const URL = BASE_URL + "/v1/products/goldbox";

	const authorization = generateHmac(REQUEST_METHOD, URL, SECRET_KEY, ACCESS_KEY);
	axios.defaults.baseURL = DOMAIN;

	try {
		const response = await axios.request({
			method: REQUEST_METHOD,
			url: URL,
			headers: { Authorization: authorization }
		});
		return response.data;
	} catch (err) {
		return err.response.data;
	}
}

module.exports = { getDeeplink, getSearchRanking,  getGoldbox };