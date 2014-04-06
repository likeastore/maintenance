function maintenence(app, options) {
	var maintenenceMode = false;

	if (typeof options === 'boolean') {
		maintenenceMode = options;
	}

	var middleware = function (req, res, next) {
		if (maintenenceMode) {
			res.render('maintenence.html');
		}

		next();
	};

	var inject = function () {
		for (var verb in app.routes) {
			var routes = app.routes[verb];
			routes.forEach(patchRoute);
		}

		function patchRoute (route) {
			route.callbacks.splice(0, 0, middleware);
		}

		return app;
	};

	return inject(app);
}

module.exports = maintenence;