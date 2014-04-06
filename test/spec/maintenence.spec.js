var request = require('request');

describe('maintenance.spec.js', function () {
	var url, app, response, results;

	before(function () {
		url = 'http://localhost:3030';
	});

	describe('start up in normal mode', function () {
		before(function () {
			app = require('../app/app')(false);
		});

		after(function (done) {
			app.close(function (err) {
				done(err);
			});
		});

		beforeEach(function (done) {
			request.get(url, function (err, resp, body) {
				response = resp;
				results = body;
				done(err);
			});
		});

		it('should return 200 (ok)', function () {
			expect(response.statusCode).to.equal(200);
		});

		it('should be empty page', function () {
			expect(results).to.equal('OK');
		});
	});

	describe('start in maintenance mode', function () {
		before(function () {
			app = require('../app/app')(true);
		});

		after(function (done) {
			app.close(function (err) {
				done(err);
			});
		});

		beforeEach(function (done) {
			request.get(url, function (err, resp, body) {
				response = resp;
				results = body;
				done(err);
			});
		});

		it('should return 200 (ok)', function () {
			expect(response.statusCode).to.equal(200);
		});

		it('should be maintenance page', function () {
			expect(results).to.equal('<h1>We are on maintenence</h1>');
		});
	});
});