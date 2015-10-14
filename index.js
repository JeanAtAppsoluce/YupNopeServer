var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 5000;

app.post('/create_card', function (req, res) {
	var nickname = req.body.nickname,
		message = req.body.message;

	console.log("got createproject with nickname "+req.body.nickname+" res:"+req.body.message);
	
	res.send("nickname:"+nickname+"message:"+message);
});

app.listen(port, function () {});