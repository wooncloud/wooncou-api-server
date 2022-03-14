const router = require('express').Router();

router.get('/', (req, res) => {
	res.send('hello world!')
});

router.get('/api/hello', (req, res) => {
	res.send('안녕하세요.');
});

module.exports = router;