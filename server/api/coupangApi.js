const axios = require('axios');
const cheerio = require('cheerio');
const { generateHmac } = require('./hmacGenerator');
const { ACCESS_KEY, SECRET_KEY } = require('../config/coupang');

const DOMAIN = "https://api-gateway.coupang.com";
const BASE_URL = "/v2/providers/affiliate_open_api/apis/openapi";
const COUPANG_BASE_URL = "https://www.coupang.com/vp/products/";

const crawlingCoupangInfo = async (url) => {
	const data = {};
	const html = await getHtml(url);
	const $ = cheerio.load(html.data);

	data.title = $(".prod-buy-header > .prod-buy-header__title").text();
	data.discountRate = $(".prod-price .discount-rate").text().trim();
	data.originPrice = $(".prod-price .origin-price").text().trim();
	data.totalPrice = $(".prod-price .prod-major-price:not([style*='display:none']) .total-price").text().trim();
	data.count = $(".prod-buy-header .count").text().trim();
	data.starRating = $(".prod-buy-header .rating-star-num").prop("style").width;
	data.images = [];
	const imageUrls = $(".prod-image .prod-image__items .prod-image__item img");
	for (const imgUrl of imageUrls) {
		const thumb = imgUrl.attribs["data-src"];
		const src = "https:" + thumb.replace(/thumbnails\/remote\/48x48ex\//ig, "");
		data.images.push(src);
	}

	return data;
}

/**
 * 딥 링크 가져오기
 * @param {*} value json object
 */
const getDeeplink = async (value) => {
	const REQUEST_METHOD = "POST";
	const URL = BASE_URL + "/deeplink"
	const orgUrl = value.coupangUrls[0];
	const data = await crawlingCoupangInfo(orgUrl);

	try {
		const authorization = generateHmac(REQUEST_METHOD, URL, SECRET_KEY, ACCESS_KEY);
		axios.defaults.baseURL = DOMAIN;

		const response = await axios.request({
			method: REQUEST_METHOD,
			url: URL,
			headers: { Authorization: authorization },
			data: value
		});

		data.link = response.data.data[0].shortenUrl;
		return data;
	} catch (err) {
		console.log(err);
		return null;
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

	
	for (const i in tempData.data.data.productData) {
		const p = tempData.data.data.productData[i];
		const productUrl = COUPANG_BASE_URL + p.productId;
		const crawledData = await crawlingCoupangInfo(productUrl);
		tempData.data.data.productData[i].extends = JSON.parse(JSON.stringify(crawledData));
	}

	try {
		const authorization = generateHmac(REQUEST_METHOD, URL, SECRET_KEY, ACCESS_KEY);
		axios.defaults.baseURL = DOMAIN;

		const response = await axios.request({
			method: REQUEST_METHOD,
			url: URL,
			headers: { Authorization: authorization }
		});

		// crawling
		for (const i in response.data.data.productData) {
			const p = response.data.data.productData[i];
			const productUrl = COUPANG_BASE_URL + p.productId;
			const crawledData = await crawlingCoupangInfo(productUrl);
			response.data.data.productData[i].extends = JSON.parse(JSON.stringify(crawledData));
		}

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

	try {
		const authorization = generateHmac(REQUEST_METHOD, URL, SECRET_KEY, ACCESS_KEY);
		axios.defaults.baseURL = DOMAIN;
	
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

const getHtml = async (value) => {
	try {
		return await axios({
			method: 'GET',
			url: value,
			headers: { 
				"accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
			}
		});
		
	} catch (error) {
		console.log(error);
	}
}

module.exports = { getDeeplink, getSearchRanking, getGoldbox };