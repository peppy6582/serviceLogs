'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	ServiceCompany = mongoose.model('ServiceCompany'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, serviceCompany;

/**
 * Service company routes tests
 */
describe('Service company CRUD tests', function() {
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

		// Save a user to the test db and create new Service company
		user.save(function() {
			serviceCompany = {
				name: 'Service company Name'
			};

			done();
		});
	});

	it('should be able to save Service company instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Service company
				agent.post('/service-companies')
					.send(serviceCompany)
					.expect(200)
					.end(function(serviceCompanySaveErr, serviceCompanySaveRes) {
						// Handle Service company save error
						if (serviceCompanySaveErr) done(serviceCompanySaveErr);

						// Get a list of Service companies
						agent.get('/service-companies')
							.end(function(serviceCompaniesGetErr, serviceCompaniesGetRes) {
								// Handle Service company save error
								if (serviceCompaniesGetErr) done(serviceCompaniesGetErr);

								// Get Service companies list
								var serviceCompanies = serviceCompaniesGetRes.body;

								// Set assertions
								(serviceCompanies[0].user._id).should.equal(userId);
								(serviceCompanies[0].name).should.match('Service company Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Service company instance if not logged in', function(done) {
		agent.post('/service-companies')
			.send(serviceCompany)
			.expect(401)
			.end(function(serviceCompanySaveErr, serviceCompanySaveRes) {
				// Call the assertion callback
				done(serviceCompanySaveErr);
			});
	});

	it('should not be able to save Service company instance if no name is provided', function(done) {
		// Invalidate name field
		serviceCompany.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Service company
				agent.post('/service-companies')
					.send(serviceCompany)
					.expect(400)
					.end(function(serviceCompanySaveErr, serviceCompanySaveRes) {
						// Set message assertion
						(serviceCompanySaveRes.body.message).should.match('Please fill Service company name');
						
						// Handle Service company save error
						done(serviceCompanySaveErr);
					});
			});
	});

	it('should be able to update Service company instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Service company
				agent.post('/service-companies')
					.send(serviceCompany)
					.expect(200)
					.end(function(serviceCompanySaveErr, serviceCompanySaveRes) {
						// Handle Service company save error
						if (serviceCompanySaveErr) done(serviceCompanySaveErr);

						// Update Service company name
						serviceCompany.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Service company
						agent.put('/service-companies/' + serviceCompanySaveRes.body._id)
							.send(serviceCompany)
							.expect(200)
							.end(function(serviceCompanyUpdateErr, serviceCompanyUpdateRes) {
								// Handle Service company update error
								if (serviceCompanyUpdateErr) done(serviceCompanyUpdateErr);

								// Set assertions
								(serviceCompanyUpdateRes.body._id).should.equal(serviceCompanySaveRes.body._id);
								(serviceCompanyUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Service companies if not signed in', function(done) {
		// Create new Service company model instance
		var serviceCompanyObj = new ServiceCompany(serviceCompany);

		// Save the Service company
		serviceCompanyObj.save(function() {
			// Request Service companies
			request(app).get('/service-companies')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Service company if not signed in', function(done) {
		// Create new Service company model instance
		var serviceCompanyObj = new ServiceCompany(serviceCompany);

		// Save the Service company
		serviceCompanyObj.save(function() {
			request(app).get('/service-companies/' + serviceCompanyObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', serviceCompany.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Service company instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Service company
				agent.post('/service-companies')
					.send(serviceCompany)
					.expect(200)
					.end(function(serviceCompanySaveErr, serviceCompanySaveRes) {
						// Handle Service company save error
						if (serviceCompanySaveErr) done(serviceCompanySaveErr);

						// Delete existing Service company
						agent.delete('/service-companies/' + serviceCompanySaveRes.body._id)
							.send(serviceCompany)
							.expect(200)
							.end(function(serviceCompanyDeleteErr, serviceCompanyDeleteRes) {
								// Handle Service company error error
								if (serviceCompanyDeleteErr) done(serviceCompanyDeleteErr);

								// Set assertions
								(serviceCompanyDeleteRes.body._id).should.equal(serviceCompanySaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Service company instance if not signed in', function(done) {
		// Set Service company user 
		serviceCompany.user = user;

		// Create new Service company model instance
		var serviceCompanyObj = new ServiceCompany(serviceCompany);

		// Save the Service company
		serviceCompanyObj.save(function() {
			// Try deleting Service company
			request(app).delete('/service-companies/' + serviceCompanyObj._id)
			.expect(401)
			.end(function(serviceCompanyDeleteErr, serviceCompanyDeleteRes) {
				// Set message assertion
				(serviceCompanyDeleteRes.body.message).should.match('User is not logged in');

				// Handle Service company error error
				done(serviceCompanyDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		ServiceCompany.remove().exec();
		done();
	});
});