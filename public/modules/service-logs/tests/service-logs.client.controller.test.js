'use strict';

(function() {
	// Service logs Controller Spec
	describe('Service logs Controller Tests', function() {
		// Initialize global variables
		var ServiceLogsController,
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

			// Initialize the Service logs controller.
			ServiceLogsController = $controller('ServiceLogsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Service log object fetched from XHR', inject(function(ServiceLogs) {
			// Create sample Service log using the Service logs service
			var sampleServiceLog = new ServiceLogs({
				name: 'New Service log'
			});

			// Create a sample Service logs array that includes the new Service log
			var sampleServiceLogs = [sampleServiceLog];

			// Set GET response
			$httpBackend.expectGET('service-logs').respond(sampleServiceLogs);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.serviceLogs).toEqualData(sampleServiceLogs);
		}));

		it('$scope.findOne() should create an array with one Service log object fetched from XHR using a serviceLogId URL parameter', inject(function(ServiceLogs) {
			// Define a sample Service log object
			var sampleServiceLog = new ServiceLogs({
				name: 'New Service log'
			});

			// Set the URL parameter
			$stateParams.serviceLogId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/service-logs\/([0-9a-fA-F]{24})$/).respond(sampleServiceLog);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.serviceLog).toEqualData(sampleServiceLog);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ServiceLogs) {
			// Create a sample Service log object
			var sampleServiceLogPostData = new ServiceLogs({
				name: 'New Service log'
			});

			// Create a sample Service log response
			var sampleServiceLogResponse = new ServiceLogs({
				_id: '525cf20451979dea2c000001',
				name: 'New Service log'
			});

			// Fixture mock form input values
			scope.name = 'New Service log';

			// Set POST response
			$httpBackend.expectPOST('service-logs', sampleServiceLogPostData).respond(sampleServiceLogResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Service log was created
			expect($location.path()).toBe('/service-logs/' + sampleServiceLogResponse._id);
		}));

		it('$scope.update() should update a valid Service log', inject(function(ServiceLogs) {
			// Define a sample Service log put data
			var sampleServiceLogPutData = new ServiceLogs({
				_id: '525cf20451979dea2c000001',
				name: 'New Service log'
			});

			// Mock Service log in scope
			scope.serviceLog = sampleServiceLogPutData;

			// Set PUT response
			$httpBackend.expectPUT(/service-logs\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/service-logs/' + sampleServiceLogPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid serviceLogId and remove the Service log from the scope', inject(function(ServiceLogs) {
			// Create new Service log object
			var sampleServiceLog = new ServiceLogs({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Service logs array and include the Service log
			scope.serviceLogs = [sampleServiceLog];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/service-logs\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleServiceLog);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.serviceLogs.length).toBe(0);
		}));
	});
}());