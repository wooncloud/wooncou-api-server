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

	return tempData;

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
const tempData = {
	"success": true,
	"data": {
		"rCode": "0",
		"rMessage": "게시글 작성 시, \"파트너스 활동을 통해 일정액의 수수료를 제공받을 수 있음\"을 기재하셔야 합니다",
		"data": {
			"landingUrl": "https://link.coupang.com/re/AFFSRP?lptag=AF8451192&pageKey=VANANA&traceid=V0-163-9573ccd299d21f74",
			"productData": [
				{
					"productId": 6357798374,
					"productName": "VSYOY 리본 헵번 프렌치 니트 원피스 봄 여성복 패션 v넥 스커트",
					"productPrice": 39500,
					"productImage": "https://static.coupangcdn.com/image/vendor_inventory/9ca0/2fde8339a543a101f502fad0a660c14f14839223f6dd828eff1549dfd145.jpg",
					"productUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF8451192&pageKey=6357798374&itemId=13407105525&vendorItemId=80826031018&traceid=V0-153-551a2556c155bf12",
					"keyword": "VANANA",
					"rank": 1,
					"isRocket": false,
					"isFreeShipping": true,
				},
				{
					"productId": 6335414476,
					"productName": "VANANA2 여성 데일리 골지나시 워머 볼레로 크롭 가디건 세트 SET",
					"productPrice": 29800,
					"productImage": "https://static.coupangcdn.com/image/vendor_inventory/697a/66683259e841d5c25fa9bb7d5f86f776acf6e9c3cc88ef067ecbe529e570.jpg",
					"productUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF8451192&pageKey=6335414476&itemId=13266156912&vendorItemId=80523804394&traceid=V0-153-03eabc88380448ad",
					"keyword": "VANANA",
					"rank": 2,
					"isRocket": true,
					"isFreeShipping": false,
				},
				{
					"productId": 6371479650,
					"productName": "VSYOY 패션 밍위안 니트 원피스 여성복 숄칼라 스커트",
					"productPrice": 35000,
					"productImage": "https://static.coupangcdn.com/image/vendor_inventory/7780/585ae39af783461b23b08a30ec1099586d53b98d9fca6c80f5a55f23ca8f.jpg",
					"productUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF8451192&pageKey=6371479650&itemId=13497515592&vendorItemId=80826025805&traceid=V0-153-3e5ea5c38ad9531a",
					"keyword": "VANANA",
					"rank": 3,
					"isRocket": false,
					"isFreeShipping": true,
				},
				{
					"productId": 6344943717,
					"productName": "VSYOY봄 셔츠 원피스 여성복 년 허리 조임 슬림 미디 스커트 스커트",
					"productPrice": 57500,
					"productImage": "https://static.coupangcdn.com/image/vendor_inventory/cd0e/4f3631269c77b6b59551171606ddfb9bdf0dadfb1d4bfa201adcdf6480f0.jpg",
					"productUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF8451192&pageKey=6344943717&itemId=13327199144&vendorItemId=80826145783&traceid=V0-153-bf12cd3cbcef92c6",
					"keyword": "VANANA",
					"rank": 4,
					"isRocket": false,
					"isFreeShipping": true,
				},
				{
					"productId": 6070823361,
					"productName": "VANANA2 국내생산 크롭기장 데일리 니트 볼레로 가디건 3color",
					"productPrice": 19800,
					"productImage": "https://static.coupangcdn.com/image/vendor_inventory/4557/9373c5b415ceb0932eacf5843f12d668323d0d6670917c78da3b4c6ca240.jpg",
					"productUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF8451192&pageKey=6070823361&itemId=11207876210&vendorItemId=78485460632&traceid=V0-153-d29cc8aa620f65a7",
					"keyword": "VANANA",
					"rank": 5,
					"isRocket": false,
					"isFreeShipping": false,
				},
				{
					"productId": 6373182204,
					"productName": "VSYOY 모던 빈티지 터틀넥 니트 원피스 여성복 반팔 타이트 스커트",
					"productPrice": 39000,
					"productImage": "https://static.coupangcdn.com/image/vendor_inventory/bc33/bbc68425d7689751af1cc4c37a9313e66f8e24ce82efe861adf3ba3515b8.jpg",
					"productUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF8451192&pageKey=6373182204&itemId=13508106584&vendorItemId=80825999441&traceid=V0-153-51430fa2f4db12a1",
					"keyword": "VANANA",
					"rank": 6,
					"isRocket": false,
					"isFreeShipping": true,
				},
				{
					"productId": 6275111777,
					"productName": "VANANA2 여성 러블리 슬림핏 단추 앙고라 유라인 니트 긴팔 티셔츠",
					"productPrice": 22800,
					"productImage": "https://static.coupangcdn.com/image/vendor_inventory/46c8/5c4d769107634b1fa4f9651dae40a1db21a2ee46e565cac88d3de56bf7ab.jpg",
					"productUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF8451192&pageKey=6275111777&itemId=12854010951&vendorItemId=80119422364&traceid=V0-153-272cc66294e14f3b",
					"keyword": "VANANA",
					"rank": 7,
					"isRocket": false,
					"isFreeShipping": false,
				},
				{
					"productId": 5342115917,
					"productName": "VANANA2 드래곤 플라이 여성 마담 선글라스 엄마 선글라스 미시 선글라스",
					"productPrice": 16900,
					"productImage": "https://static.coupangcdn.com/image/vendor_inventory/bd41/824200ea19f6281173837777443369e3c5067229a08d235289d05d69863a.png",
					"productUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF8451192&pageKey=5342115917&itemId=7834064488&vendorItemId=75123844427&traceid=V0-153-1b5ecc6ac8450aca",
					"keyword": "VANANA",
					"rank": 8,
					"isRocket": true,
					"isFreeShipping": false,
				},
				{
					"productId": 5884886407,
					"productName": "VANANA2 더블체크 여성 간절기 크롭 셔츠 남방",
					"productPrice": 19800,
					"productImage": "https://static.coupangcdn.com/image/vendor_inventory/7376/d9045a2fd04118d7d419b1a667edd42585301163312e733805cd810e492e.jpg",
					"productUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF8451192&pageKey=5884886407&itemId=10331573383&vendorItemId=77613789643&traceid=V0-153-75e62e934f7d1c6d",
					"keyword": "VANANA",
					"rank": 9,
					"isRocket": false,
					"isFreeShipping": false,
				},
				{
					"productId": 6287332248,
					"productName": "VANANA2 여성 사계절 슬림핏 카라 골지 5부 원피스",
					"productPrice": 19800,
					"productImage": "https://static.coupangcdn.com/image/vendor_inventory/0230/520bc5353236491ba8d8f27c33675d1eafec63515d759a9079b775705a1a.jpg",
					"productUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF8451192&pageKey=6287332248&itemId=12937642605&vendorItemId=80202013380&traceid=V0-153-d77dae2d6b845207",
					"keyword": "VANANA",
					"rank": 10,
					"isRocket": false,
					"isFreeShipping": false,
				}
			]
		}
	}
}

module.exports = { getDeeplink, getSearchRanking, getGoldbox };