const express = require('express')
const app = express()
const port = 5000
const config = require('./config/key');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const axios = require('axios');

// [bodyParser Setting]
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

// [mongoose]
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
	useNewUrlParser:true,
	useUnifiedTopology:true,
	useCreateIndex:true,
	useFindAndModify:false
}).then(() => console.log("Mongo DB connection..."))
.catch(err => console.log(err))

// [SCHEDULER]
const scheduler = require('./schedule');
scheduler.goldboxSchedule();

// [ROUTER]
const helloRouter = require('./router/Hello');
const usersRouter = require('./router/Users');
const postsRouter = require('./router/Posts');
const tagsRouter = require('./router/Tags');
const reportRouter = require('./router/Report');
const coupangRouter = require('./router/Coupang');
const goldbox = require('./router/Goldbox');
const common = require('./router/Common');
app.use('/hello', helloRouter);
app.use('/api/users', usersRouter);
app.use('/api', postsRouter);
app.use('/api', tagsRouter);
app.use('/api', reportRouter);
app.use('/api/coupang', coupangRouter);
app.use('/api/goldbox', goldbox);
app.use('/api/common', common);

app.get('/', (req, res) => {
	res.send('wooncou')
});

app.listen(port, () => console.log(`Wooncou app listening on port ${port}!`))
