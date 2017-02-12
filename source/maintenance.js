var express = require('express');

function maintenance(app, options) {
	var mode = false,
		endpoint = false,
		url ='/maintenance',
		accessKey,
		view = 'maintenance.html',
		api = false,
		status = 503,
		message = 'sorry, we are on maintenance';

	if (typeof options === 'boolean') {
		mode = options;
	} else if (typeof options === 'object') {
		mode = options.current || mode;
		endpoint = options.httpEndpoint || endpoint;
		url = options.url || url;
		accessKey = options.accessKey;
		view = options.view || view;
		api = options.api || api;
		status = options.status || status;
		message = options.message || message;
	} else {
		throw new Error('unsuported options');
	}

	var checkAccess = function (req, res, next) {
		if (!accessKey) {
			return next();
		}

		var match = req.query.access_key === accessKey;
		if (match) {
			return next();
		}

		res.sendStatus(401);
	};

	var server = function (app) {
		if (endpoint) {
			var router = express.Router();
			router.post(url, checkAccess, function (req, res) {
				mode = true;
				res.sendStatus(200);
			});

			router.delete(url, checkAccess, function (req, res) {
				
				mode = false;
				res.sendStatus(200);
			});
			
			app.use('/',router);
		}
	};

	var handle = function (req, res) {

		var isApi = api && req.url.indexOf(api) === 0;

		res.status(status);

		if (isApi) {
			return res.json({message: message});
		}

		return res.render(view);
	};

	var middleware = function (req, res, next) {
		if (mode) {
			var request_url = req.url.split("?")[0];
			if(request_url === url && ["DELETE","POST"].indexOf(req.method) != -1){
				next();
			}
			else{
				return handle(req, res);
			}
			
			
		}
		else{
			next();
		}

		
	};

	var inject = function (app) {
		app.use(middleware);
		return app;
	};

	return server(inject(app));
}

module.exports = maintenance;
