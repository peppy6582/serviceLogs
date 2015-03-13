'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Department = mongoose.model('Department'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, department;

/**
 * Department routes tests
 */
describe('Department CRUD tests', function() {
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

		// Save a user to the test db and create new Department
		user.save(function() {
			department = {
				name: 'Department Name'
			};

			done();
		});
	});

	it('should be able to save Department instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Department
				agent.post('/departments')
					.send(department)
					.expect(200)
					.end(function(departmentSaveErr, departmentSaveRes) {
						// Handle Department save error
						if (departmentSaveErr) done(departmentSaveErr);

						// Get a list of Departments
						agent.get('/departments')
							.end(function(departmentsGetErr, departmentsGetRes) {
								// Handle Department save error
								if (departmentsGetErr) done(departmentsGetErr);

								// Get Departments list
								var departments = departmentsGetRes.body;

								// Set assertions
								(departments[0].user._id).should.equal(userId);
								(departments[0].name).should.match('Department Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Department instance if not logged in', function(done) {
		agent.post('/departments')
			.send(department)
			.expect(401)
			.end(function(departmentSaveErr, departmentSaveRes) {
				// Call the assertion callback
				done(departmentSaveErr);
			});
	});

	it('should not be able to save Department instance if no name is provided', function(done) {
		// Invalidate name field
		department.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Department
				agent.post('/departments')
					.send(department)
					.expect(400)
					.end(function(departmentSaveErr, departmentSaveRes) {
						// Set message assertion
						(departmentSaveRes.body.message).should.match('Please fill Department name');
						
						// Handle Department save error
						done(departmentSaveErr);
					});
			});
	});

	it('should be able to update Department instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Department
				agent.post('/departments')
					.send(department)
					.expect(200)
					.end(function(departmentSaveErr, departmentSaveRes) {
						// Handle Department save error
						if (departmentSaveErr) done(departmentSaveErr);

						// Update Department name
						department.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Department
						agent.put('/departments/' + departmentSaveRes.body._id)
							.send(department)
							.expect(200)
							.end(function(departmentUpdateErr, departmentUpdateRes) {
								// Handle Department update error
								if (departmentUpdateErr) done(departmentUpdateErr);

								// Set assertions
								(departmentUpdateRes.body._id).should.equal(departmentSaveRes.body._id);
								(departmentUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Departments if not signed in', function(done) {
		// Create new Department model instance
		var departmentObj = new Department(department);

		// Save the Department
		departmentObj.save(function() {
			// Request Departments
			request(app).get('/departments')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Department if not signed in', function(done) {
		// Create new Department model instance
		var departmentObj = new Department(department);

		// Save the Department
		departmentObj.save(function() {
			request(app).get('/departments/' + departmentObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', department.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Department instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Department
				agent.post('/departments')
					.send(department)
					.expect(200)
					.end(function(departmentSaveErr, departmentSaveRes) {
						// Handle Department save error
						if (departmentSaveErr) done(departmentSaveErr);

						// Delete existing Department
						agent.delete('/departments/' + departmentSaveRes.body._id)
							.send(department)
							.expect(200)
							.end(function(departmentDeleteErr, departmentDeleteRes) {
								// Handle Department error error
								if (departmentDeleteErr) done(departmentDeleteErr);

								// Set assertions
								(departmentDeleteRes.body._id).should.equal(departmentSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Department instance if not signed in', function(done) {
		// Set Department user 
		department.user = user;

		// Create new Department model instance
		var departmentObj = new Department(department);

		// Save the Department
		departmentObj.save(function() {
			// Try deleting Department
			request(app).delete('/departments/' + departmentObj._id)
			.expect(401)
			.end(function(departmentDeleteErr, departmentDeleteRes) {
				// Set message assertion
				(departmentDeleteRes.body.message).should.match('User is not logged in');

				// Handle Department error error
				done(departmentDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Department.remove().exec();
		done();
	});
});