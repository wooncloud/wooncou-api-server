const schedule = require('node-schedule');
const { getGoldbox } = require('./api/coupangApi');
const { Goldbox } = require('./models/Goldbox');

function goldboxSchedule() {
	const job = schedule.scheduleJob("10 00 8 * * *", async function() {
		console.log("골드박스 데이터를 가져옵니다.");

		const data = await getGoldbox();
		if (!data) {
			console.error("골드박스 결과가 없습니다.");
		} else {
			await Goldbox.deleteMany({});

			Goldbox.insertMany(data.data, (err) => {
				if (err) {
					console.error("골드박스 정보 저장에 실패했습니다.");
				} else {
					console.log("골드박스 정보를 저장했습니다.");
				}
			});
		}
	});
}

module.exports = {goldboxSchedule}