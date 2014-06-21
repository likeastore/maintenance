var request = require('request');

describe('maintenance.js', function () {
	var url, app, response, results;

	before(function () {
		url = 'http://localhost:3030';
	});

	describe('when starting up in normal mode', function () {
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

	describe('when starting in maintenance mode', function () {
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

		it('should return 503 (Service Unavailable)', function () {
			expect(response.statusCode).to.equal(503);
		});

		it('should be maintenance page', function () {
			expect(results).to.equal('<h1>We are on maintenance</h1>');
		});

		it('should not call next middleware', function () {
			expect(app.called['/']).to.not.be.ok;
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
				request.post(url + '/maintenance', done);
			});

			beforeEach(function (done) {
				request.get(url, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should return maintenance page', function () {
				expect(response.statusCode).to.equal(503);
				expect(results).to.equal('<h1>We are on maintenance</h1>');
			});

			describe('and return back to normal', function () {
				beforeEach(function (done) {
					request.del(url + '/maintenance', done);
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

			it('should return maintenance page', function () {
				expect(response.statusCode).to.equal(503);
				expect(results).to.equal('<h1>We are on maintenance</h1>');
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

	describe('with enabled endpoint and access key', function () {
		before(function () {
			app = require('../app/app')({httpEndpoint: true, accessKey: 'secret'});
		});

		after(function (done) {
			app.close(function (err) {
				done(err);
			});
		});

		describe('secret is wrong', function () {
			describe('when enabled', function () {
				beforeEach(function (done) {
					request.post(url + '/maintenance?access_key=wrong', function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it('should respond 401 (not authorized)', function () {
					expect(response.statusCode).to.equal(401);
				});
			});

			describe('when disabled', function () {
				beforeEach(function (done) {
					request.del(url + '/maintenance?access_key=wrong', function (err, resp, body) {
						response = resp;
						results = body;
						done(err);
					});
				});

				it('should respond 401 (not authorized)', function () {
					expect(response.statusCode).to.equal(401);
				});
			});
		});

		describe('put to maintenance', function () {
			beforeEach(function (done) {
				request.post(url + '/maintenance?access_key=secret', done);
			});

			beforeEach(function (done) {
				request.get(url, function (err, resp, body) {
					response = resp;
					results = body;
					done(err);
				});
			});

			it('should return maintenance page', function () {
				expect(response.statusCode).to.equal(503);
				expect(results).to.equal('<h1>We are on maintenance</h1>');
			});

			describe('and return back to normal', function () {
				beforeEach(function (done) {
					request.del(url + '/maintenance?access_key=secret', done);
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

	describe('with custom view', function () {
		before(function () {
			app = require('../app/app')({current: true, view: 'maintenance2.html'});
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

		it('should return 503 (Service Unavailable)', function () {
			expect(response.statusCode).to.equal(503);
		});

		it('should be maintenance page', function () {
			expect(results).to.equal('<h1>We are on maintenance 2</h1>');
		});
	});

	describe('with api', function () {
		before(function () {
			app = require('../app/app')({current: true, api: '/api' });
		});

		after(function (done) {
			app.close(function (err) {
				done(err);
			});
		});

		beforeEach(function (done) {
			request.get({url: url + '/api/call', json: true}, function (err, resp, body) {
				response = resp;
				results = body;
				done(err);
			});
		});

		it('should return 503 (unavailable)', function () {
			expect(response.statusCode).to.equal(503);
		});

		it('should be maintenance page', function () {
			expect(results.message).to.equal('sorry, we are on maintenance');
		});
	});

	describe('with api and custom status', function () {
		before(function () {
			app = require('../app/app')({current: true, api: '/api', status: 501});
		});

		after(function (done) {
			app.close(function (err) {
				done(err);
			});
		});

		beforeEach(function (done) {
			request.get({url: url + '/api/call', json: true}, function (err, resp, body) {
				response = resp;
				results = body;
				done(err);
			});
		});

		it('should return 501 (unavailable)', function () {
			expect(response.statusCode).to.equal(501);
		});

		it('should be maintenance page', function () {
			expect(results.message).to.equal('sorry, we are on maintenance');
		});
	});

	describe('with api and custom status and message', function () {
		before(function () {
			app = require('../app/app')({current: true, api: '/api', status: 501, message: 'down, down, down'});
		});

		after(function (done) {
			app.close(function (err) {
				done(err);
			});
		});

		beforeEach(function (done) {
			request.get({url: url + '/api/call', json: true}, function (err, resp, body) {
				response = resp;
				results = body;
				done(err);
			});
		});

		it('should return 501 (unavailable)', function () {
			expect(response.statusCode).to.equal(501);
		});

		it('should be maintenance page', function () {
			expect(results.message).to.equal('down, down, down');
		});
	});
});