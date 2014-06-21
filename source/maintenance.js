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

		res.send(401);
	};

	var server = function (app) {
		if (endpoint) {
			app.post(url, checkAccess, function (req, res) {
				mode = true;
				res.send(200);
			});

			app.del(url, checkAccess, function (req, res) {
				mode = false;
				res.send(200);
			});
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
			return handle(req, res);
		}

		next();
	};

	var inject = function (app) {
		for (var verb in app.routes) {
			var routes = app.routes[verb];
			routes.forEach(patchRoute);
		}

		function patchRoute (route) {
			route.callbacks.splice(0, 0, middleware);
		}

		return app;
	};

	return server(inject(app));
}

module.exports = maintenance;
