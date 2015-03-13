'use strict';

(function() {
	// Departments Controller Spec
	describe('Departments Controller Tests', function() {
		// Initialize global variables
		var DepartmentsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Departments controller.
			DepartmentsController = $controller('DepartmentsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Department object fetched from XHR', inject(function(Departments) {
			// Create sample Department using the Departments service
			var sampleDepartment = new Departments({
				name: 'New Department'
			});

			// Create a sample Departments array that includes the new Department
			var sampleDepartments = [sampleDepartment];

			// Set GET response
			$httpBackend.expectGET('departments').respond(sampleDepartments);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.departments).toEqualData(sampleDepartments);
		}));

		it('$scope.findOne() should create an array with one Department object fetched from XHR using a departmentId URL parameter', inject(function(Departments) {
			// Define a sample Department object
			var sampleDepartment = new Departments({
				name: 'New Department'
			});

			// Set the URL parameter
			$stateParams.departmentId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/departments\/([0-9a-fA-F]{24})$/).respond(sampleDepartment);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.department).toEqualData(sampleDepartment);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Departments) {
			// Create a sample Department object
			var sampleDepartmentPostData = new Departments({
				name: 'New Department'
			});

			// Create a sample Department response
			var sampleDepartmentResponse = new Departments({
				_id: '525cf20451979dea2c000001',
				name: 'New Department'
			});

			// Fixture mock form input values
			scope.name = 'New Department';

			// Set POST response
			$httpBackend.expectPOST('departments', sampleDepartmentPostData).respond(sampleDepartmentResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Department was created
			expect($location.path()).toBe('/departments/' + sampleDepartmentResponse._id);
		}));

		it('$scope.update() should update a valid Department', inject(function(Departments) {
			// Define a sample Department put data
			var sampleDepartmentPutData = new Departments({
				_id: '525cf20451979dea2c000001',
				name: 'New Department'
			});

			// Mock Department in scope
			scope.department = sampleDepartmentPutData;

			// Set PUT response
			$httpBackend.expectPUT(/departments\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/departments/' + sampleDepartmentPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid departmentId and remove the Department from the scope', inject(function(Departments) {
			// Create new Department object
			var sampleDepartment = new Departments({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Departments array and include the Department
			scope.departments = [sampleDepartment];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/departments\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDepartment);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.departments.length).toBe(0);
		}));
	});
}());