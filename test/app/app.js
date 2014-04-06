function create(options) {
	var express = require('express');
	var maintenance = require('../../source/maintenence');

	var app = express();

	app.configure(function () {
		app.set('port', process.env.PORT || 3030);
		app.set('views', __dirname + '/views');
		app.engine('html', require('ejs').renderFile);
	});

	app.get('/', function (req, res) {
		res.send(200);
	});

	app.get('/api/call', function (req, res) {
		res.json({response: 'response'});
	});

	maintenance(app, options);

	var server = app.listen(app.get('port'));

	return {
		close: function (callback) {
			server.close(callback);
		}
	};
}

module.exports = create;
