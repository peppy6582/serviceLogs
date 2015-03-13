'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ServiceLog = mongoose.model('ServiceLog'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, serviceLog;

/**
 * Service log routes tests
 */
describe('Service log CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Service log
		user.save(function() {
			serviceLog = {
				name: 'Service log Name'
			};

			done();
		});
	});

	it('should be able to save Service log instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Service log
				agent.post('/service-logs')
					.send(serviceLog)
					.expect(200)
					.end(function(serviceLogSaveErr, serviceLogSaveRes) {
						// Handle Service log save error
						if (serviceLogSaveErr) done(serviceLogSaveErr);

						// Get a list of Service logs
						agent.get('/service-logs')
							.end(function(serviceLogsGetErr, serviceLogsGetRes) {
								// Handle Service log save error
								if (serviceLogsGetErr) done(serviceLogsGetErr);

								// Get Service logs list
								var serviceLogs = serviceLogsGetRes.body;

								// Set assertions
								(serviceLogs[0].user._id).should.equal(userId);
								(serviceLogs[0].name).should.match('Service log Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Service log instance if not logged in', function(done) {
		agent.post('/service-logs')
			.send(serviceLog)
			.expect(401)
			.end(function(serviceLogSaveErr, serviceLogSaveRes) {
				// Call the assertion callback
				done(serviceLogSaveErr);
			});
	});

	it('should not be able to save Service log instance if no name is provided', function(done) {
		// Invalidate name field
		serviceLog.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Service log
				agent.post('/service-logs')
					.send(serviceLog)
					.expect(400)
					.end(function(serviceLogSaveErr, serviceLogSaveRes) {
						// Set message assertion
						(serviceLogSaveRes.body.message).should.match('Please fill Service log name');
						
						// Handle Service log save error
						done(serviceLogSaveErr);
					});
			});
	});

	it('should be able to update Service log instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Service log
				agent.post('/service-logs')
					.send(serviceLog)
					.expect(200)
					.end(function(serviceLogSaveErr, serviceLogSaveRes) {
						// Handle Service log save error
						if (serviceLogSaveErr) done(serviceLogSaveErr);

						// Update Service log name
						serviceLog.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Service log
						agent.put('/service-logs/' + serviceLogSaveRes.body._id)
							.send(serviceLog)
							.expect(200)
							.end(function(serviceLogUpdateErr, serviceLogUpdateRes) {
								// Handle Service log update error
								if (serviceLogUpdateErr) done(serviceLogUpdateErr);

								// Set assertions
								(serviceLogUpdateRes.body._id).should.equal(serviceLogSaveRes.body._id);
								(serviceLogUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Service logs if not signed in', function(done) {
		// Create new Service log model instance
		var serviceLogObj = new ServiceLog(serviceLog);

		// Save the Service log
		serviceLogObj.save(function() {
			// Request Service logs
			request(app).get('/service-logs')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Service log if not signed in', function(done) {
		// Create new Service log model instance
		var serviceLogObj = new ServiceLog(serviceLog);

		// Save the Service log
		serviceLogObj.save(function() {
			request(app).get('/service-logs/' + serviceLogObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', serviceLog.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Service log instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Service log
				agent.post('/service-logs')
					.send(serviceLog)
					.expect(200)
					.end(function(serviceLogSaveErr, serviceLogSaveRes) {
						// Handle Service log save error
						if (serviceLogSaveErr) done(serviceLogSaveErr);

						// Delete existing Service log
						agent.delete('/service-logs/' + serviceLogSaveRes.body._id)
							.send(serviceLog)
							.expect(200)
							.end(function(serviceLogDeleteErr, serviceLogDeleteRes) {
								// Handle Service log error error
								if (serviceLogDeleteErr) done(serviceLogDeleteErr);

								// Set assertions
								(serviceLogDeleteRes.body._id).should.equal(serviceLogSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Service log instance if not signed in', function(done) {
		// Set Service log user 
		serviceLog.user = user;

		// Create new Service log model instance
		var serviceLogObj = new ServiceLog(serviceLog);

		// Save the Service log
		serviceLogObj.save(function() {
			// Try deleting Service log
			request(app).delete('/service-logs/' + serviceLogObj._id)
			.expect(401)
			.end(function(serviceLogDeleteErr, serviceLogDeleteRes) {
				// Set message assertion
				(serviceLogDeleteRes.body.message).should.match('User is not logged in');

				// Handle Service log error error
				done(serviceLogDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ServiceLog.remove().exec();
		done();
	});
});