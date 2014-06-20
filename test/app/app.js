function create(options) {
	var express = require('express');
	var maintenance = require('../../source/maintenance');

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

	// Adding another middleware so we can be sure they play nicely
	var nextMiddleware = function(req, res, next) {
		next();
	};

	for (var verb in app.routes) {
		var routes = app.routes[verb];
		routes.forEach(function(route) {
			route.callbacks.splice(0, 0, function(req, res, next) {
				return nextMiddleware(req, res, next);
			});
		});
	}

	maintenance(app, options);

	var server = app.listen(app.get('port'));

	return {
		close: function (callback) {
			server.close(callback);
		},
		setNextMiddleware: function(middleware) {
			nextMiddleware = middleware;
		}
	};
}

module.exports = create;
