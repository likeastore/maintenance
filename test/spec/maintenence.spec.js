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

	describe('with enabled endpoint', function () {
		before(function () {
			app = require('../app/app')({httpEndpoint: true});
		});

		after(function (done) {
			app.close(function (err) {
				done(err);
			});
		});

		describe('initially normal mode', function () {
			beforeEach(function (done) {
				request.get(url, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should return normal page', function () {
				expect(response.statusCode).to.equal(200);
				expect(results).to.equal('OK');
			});
		});

		describe('put to maintenance', function () {
			beforeEach(function (done) {
				request.post(url + '/maintenence', done);
			});

			beforeEach(function (done) {
				request.get(url, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should return maintenence page', function () {
				expect(response.statusCode).to.equal(200);
				expect(results).to.equal('<h1>We are on maintenence</h1>');
			});

			describe('and return back to normal', function () {
				beforeEach(function (done) {
					request.del(url + '/maintenence', done);
				});

				beforeEach(function (done) {
					request.get(url, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it('should return normal page', function () {
					expect(response.statusCode).to.equal(200);
					expect(results).to.equal('OK');
				});
			});
		});
	});

	describe('with enabled endpoint and custom url', function () {
		before(function () {
			app = require('../app/app')({httpEndpoint: true, url: '/my/mt'});
		});

		after(function (done) {
			app.close(function (err) {
				done(err);
			});
		});

		describe('put to maintenance', function () {
			beforeEach(function (done) {
				request.post(url + '/my/mt', done);
			});

			beforeEach(function (done) {
				request.get(url, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should return maintenence page', function () {
				expect(response.statusCode).to.equal(200);
				expect(results).to.equal('<h1>We are on maintenence</h1>');
			});

			describe('and return back to normal', function () {
				beforeEach(function (done) {
					request.del(url + '/my/mt', done);
				});

				beforeEach(function (done) {
					request.get(url, function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it('should return normal page', function () {
					expect(response.statusCode).to.equal(200);
					expect(results).to.equal('OK');
				});
			});
		});
	});
});