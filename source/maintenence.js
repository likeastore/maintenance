function maintenence(app, options) {
	var mode = false,
		endpoint = false,
		url ='/maintenence',
		accessKey,
		view = 'maintenence.html';

	if (typeof options === 'boolean') {
		mode = options;
	} else if (typeof options === 'object') {
		mode = options.current || mode;
		endpoint = options.httpEndpoint || endpoint;
		url = options.url || url;
		accessKey = options.accessKey;
		view = options.view || view;
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

	var middleware = function (req, res, next) {
		if (mode) {
			res.render(view);
		}

		next();
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

module.exports = maintenence;