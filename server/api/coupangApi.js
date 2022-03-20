const axios = require('axios');
const cheerio = require('cheerio');
const { generateHmac } = require('./hmacGenerator');
const { ACCESS_KEY, SECRET_KEY } = require('../config/coupang');

const DOMAIN = "https://api-gateway.coupang.com";
const BASE_URL = "/v2/providers/affiliate_open_api/apis/openapi";

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
		const src = "https:" + thumb.replace(/48x48ex/ig, "492x492ex");
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
	return tempData;

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
            "landingUrl": "https://link.coupang.com/re/AFFSRP?lptag=AF8451192&pageKey=%EB%85%B8%ED%8A%B8%EB%B6%81&traceid=V0-163-146d5d1a4c3ad405",
            "productData": [
                {
                    "productId": 6398790876,
                    "productName": "MSI 2022 Prestige 15.6, 카본그레이, MS-16S1, 코어i7, 512GB, 16GB, Free DOS",
                    "productPrice": 1649000,
                    "productImage": "https://static.coupangcdn.com/image/rs_quotation_api/3z2gde9c/47193d6b55bb4a5999eb5e536ebbf5a5.jpg",
                    "productUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF8451192&pageKey=6398790876&itemId=13674283161&vendorItemId=80926244507&traceid=V0-153-cf9599d2d043547d",
                    "keyword": "노트북",
                    "rank": 1,
                    "isRocket": true,
                    "isFreeShipping": false
                },
                {
                    "productId": 6398753538,
                    "productName": "MSI 2022 Summit E13 Flip Evo, 블랙 + 골드, Summit E13 Flip Evo A12MT 009KR, 코어i7, 1024GB, 16GB, WIN11 Home",
                    "productPrice": 1999000,
                    "productImage": "https://static.coupangcdn.com/image/retail/images/2022/03/16/16/7/d7eee17b-f88b-4736-b606-fced4a162cfc.JPG",
                    "productUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF8451192&pageKey=6398753538&itemId=13674101914&vendorItemId=80926066597&traceid=V0-153-eebfb44e0a6e969d",
                    "keyword": "노트북",
                    "rank": 2,
                    "isRocket": true,
                    "isFreeShipping": false
                },
                {
                    "productId": 6056850501,
                    "productName": "에이수스 2021 VivoBook 14.1, 드리미 화이트, 코어i3 11세대, 256GB, 4GB, Free DOS, X413EA-CP003",
                    "productPrice": 499000,
                    "productImage": "https://static.coupangcdn.com/image/rs_quotation_api/d00heobh/63745f53d4334de3a13423a9fe64a2b9.jpg",
                    "productUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF8451192&pageKey=6056850501&itemId=11121796517&vendorItemId=78400481014&traceid=V0-153-7aba6f10d3985e4f",
                    "keyword": "노트북",
                    "rank": 3,
                    "isRocket": true,
                    "isFreeShipping": false
                },
                {
                    "productId": 5358757879,
                    "productName": "삼성전자 2021 노트북 플러스2 15.6, 퓨어 화이트, 셀러론, NVMe128GB, 8GB, WIN10 Pro, NT550XDA-K14AW",
                    "productPrice": 519510,
                    "productImage": "https://static.coupangcdn.com/image/retail/images/1606466026622356-49007cab-6880-46d0-8b20-4816f10541b5.jpg",
                    "productUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF8451192&pageKey=5358757879&itemId=7416308410&vendorItemId=74707281741&traceid=V0-153-3ee10f6c805b6a78",
                    "keyword": "노트북",
                    "rank": 4,
                    "isRocket": true,
                    "isFreeShipping": false
                },
                {
                    "productId": 322895378,
                    "productName": "이태원클라쓰북 그램스타일 노트북 풀패키지미개봉 NB141LTN41 8세대 14 IPS FHD 윈10탑재, 그레이, NB141LTN41 [32G+SD64G]",
                    "productPrice": 299000,
                    "productImage": "https://static.coupangcdn.com/image/vendor_inventory/e5d5/529092ec64ebac696238ea8265ce8b4785260b851e1069190a4a657c47f2.jpg",
                    "productUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF8451192&pageKey=322895378&itemId=1034232693&vendorItemId=5485152151&traceid=V0-153-d8a3411d285e8c29",
                    "keyword": "노트북",
                    "rank": 5,
                    "isRocket": false,
                    "isFreeShipping": true
                },
                {
                    "productId": 6389123629,
                    "productName": "삼성전자 노트북9 METAL NT901X5L 가볍고 슬림한 1.29kg 코어i7 대용량 SSD512GB 윈10 탑재, WIN10 Home, 8GB, 512GB, 그레이",
                    "productPrice": 697000,
                    "productImage": "https://static.coupangcdn.com/image/vendor_inventory/d92a/5e59ed8162691abea4394141acc3d85fb8ecf96cc64a4fc4245a971979e6.jpg",
                    "productUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF8451192&pageKey=6389123629&itemId=13610833797&vendorItemId=80937415722&traceid=V0-153-928ee94c3fd50897",
                    "keyword": "노트북",
                    "rank": 6,
                    "isRocket": false,
                    "isFreeShipping": true
                },
                {
                    "productId": 4679989253,
                    "productName": "LG전자 2021 울트라 PC 15.6 + HDMI케이블 + 무선마우스 + 마우스패드 + 키스킨, 화이트, 코어i5 11세대, 256GB, 8GB, Free DOS, 15UD50P-GX50K",
                    "productPrice": 799000,
                    "productImage": "https://static.coupangcdn.com/image/rs_quotation_api/rmvdop7s/cd49540977c94f6da17c3da8baa87df9.jpg",
                    "productUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF8451192&pageKey=4679989253&itemId=6442545635&vendorItemId=73737059406&traceid=V0-153-d92de13d7ef941c2",
                    "keyword": "노트북",
                    "rank": 7,
                    "isRocket": true,
                    "isFreeShipping": false
                },
                {
                    "productId": 4841548763,
                    "productName": "LG전자 2020 울트라 PC 14, 화이트, 셀러론, 512GB, 8GB, WIN10 Home, 14U390-ME1TK",
                    "productPrice": 526000,
                    "productImage": "https://static.coupangcdn.com/image/rs_quotation_api/y7huhkcv/98d514ad1caa4012952812e2bb95f611.jpg",
                    "productUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF8451192&pageKey=4841548763&itemId=6257652932&vendorItemId=73553348809&traceid=V0-153-9a25bd3005b7050e",
                    "keyword": "노트북",
                    "rank": 8,
                    "isRocket": true,
                    "isFreeShipping": false
                },
                {
                    "productId": 6396298833,
                    "productName": "삼성전자 코어i7 지포스 게이밍노트북 노트북 NT871Z5G 네이비, WIN10 Home, 8GB, 256GB",
                    "productPrice": 539000,
                    "productImage": "https://static.coupangcdn.com/image/vendor_inventory/29e7/5edd0efd17210f9d741c90700a3704dc4cdad6fd9c2542351fcce059ea99.jpeg",
                    "productUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF8451192&pageKey=6396298833&itemId=13659405316&vendorItemId=80937447100&traceid=V0-153-7bf1744f42156d7d",
                    "keyword": "노트북",
                    "rank": 9,
                    "isRocket": false,
                    "isFreeShipping": true
                },
                {
                    "productId": 6250688061,
                    "productName": "베이직스 2021 베이직북13 2세대, 베이직 골드, BB1321FW, 셀러론, 256GB, 8GB, WIN10 Home",
                    "productPrice": 379000,
                    "productImage": "https://static.coupangcdn.com/image/retail/images/13149862488637213-4bb77df0-85c6-496e-a2d3-599f8715b504.jpg",
                    "productUrl": "https://link.coupang.com/re/AFFSDP?lptag=AF8451192&pageKey=6250688061&itemId=12668966123&vendorItemId=79936102915&traceid=V0-153-65e9a34b2f51c744",
                    "keyword": "노트북",
                    "rank": 10,
                    "isRocket": true,
                    "isFreeShipping": false
                }
            ]
        }
    }
}

module.exports = { getDeeplink, getSearchRanking, getGoldbox };