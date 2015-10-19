var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
// var dbUrl = process.env.MONGOHQ_URL || 'mongodb://<dbuser>:<dbpassword>@ds039431.mongolab.com:39431/heroku_4nmklljt';

mongoose.connect(process.env.MONGOLAB_URI + '/cards');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
	console.log("did connect to cards db");
});

var cardSchema = mongoose.Schema({
	owner: String,
	message: String
});

cardSchema.method.toString = function () {
	return "card created by " + this.owner + "\n" + "message :" + this.message + "\n\n";
}

var Card = mongoose.model('Card', cardSchema);


var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 5000;

app.post('/create_card', function (req, res) {
	var owner = req.body.owner,
		message = req.body.message;

	console.log("got createproject with owner "+owner+" res:"+message);

	var card = new Card({
		owner: owner,
		message: message
	});

	// res.send("RECEIVED PROJECT ! owner is'"+owner+"'; message is'"+message+"'");
	card.save(function (err, card) {
		if (err) {
			res.send("ERROR: " + err);
		} else {
			res.send("NEW PROJECT CREATED ! owner is'"+owner+"'; message is'"+message+"'");
		}
	});
});

app.param('owner', function (req, res, next, owner) {
	console.log("defined owner", owner);
	next();
});
app.get('/get_cards/:owner', function (req, res) {
	var owner = req.params.owner;

	var cards = Card.find({ 'owner': owner }),
		responseText = 'PROJECTS BY ' + owner + '\ngot ' + cards.count + ' cards';

	for (var i = cards.length - 1; i >= 0; i--) {
		var card = cards[i];

		responseText += card.toString();
	};

	res.send(responseText);
});

app.listen(port, function () {});