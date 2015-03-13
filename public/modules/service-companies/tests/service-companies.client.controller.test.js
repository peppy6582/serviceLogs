'use strict';

(function() {
	// Service companies Controller Spec
	describe('Service companies Controller Tests', function() {
		// Initialize global variables
		var ServiceCompaniesController,
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

			// Initialize the Service companies controller.
			ServiceCompaniesController = $controller('ServiceCompaniesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Service company object fetched from XHR', inject(function(ServiceCompanies) {
			// Create sample Service company using the Service companies service
			var sampleServiceCompany = new ServiceCompanies({
				name: 'New Service company'
			});

			// Create a sample Service companies array that includes the new Service company
			var sampleServiceCompanies = [sampleServiceCompany];

			// Set GET response
			$httpBackend.expectGET('service-companies').respond(sampleServiceCompanies);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.serviceCompanies).toEqualData(sampleServiceCompanies);
		}));

		it('$scope.findOne() should create an array with one Service company object fetched from XHR using a serviceCompanyId URL parameter', inject(function(ServiceCompanies) {
			// Define a sample Service company object
			var sampleServiceCompany = new ServiceCompanies({
				name: 'New Service company'
			});

			// Set the URL parameter
			$stateParams.serviceCompanyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/service-companies\/([0-9a-fA-F]{24})$/).respond(sampleServiceCompany);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.serviceCompany).toEqualData(sampleServiceCompany);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(ServiceCompanies) {
			// Create a sample Service company object
			var sampleServiceCompanyPostData = new ServiceCompanies({
				name: 'New Service company'
			});

			// Create a sample Service company response
			var sampleServiceCompanyResponse = new ServiceCompanies({
				_id: '525cf20451979dea2c000001',
				name: 'New Service company'
			});

			// Fixture mock form input values
			scope.name = 'New Service company';

			// Set POST response
			$httpBackend.expectPOST('service-companies', sampleServiceCompanyPostData).respond(sampleServiceCompanyResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Service company was created
			expect($location.path()).toBe('/service-companies/' + sampleServiceCompanyResponse._id);
		}));

		it('$scope.update() should update a valid Service company', inject(function(ServiceCompanies) {
			// Define a sample Service company put data
			var sampleServiceCompanyPutData = new ServiceCompanies({
				_id: '525cf20451979dea2c000001',
				name: 'New Service company'
			});

			// Mock Service company in scope
			scope.serviceCompany = sampleServiceCompanyPutData;

			// Set PUT response
			$httpBackend.expectPUT(/service-companies\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/service-companies/' + sampleServiceCompanyPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid serviceCompanyId and remove the Service company from the scope', inject(function(ServiceCompanies) {
			// Create new Service company object
			var sampleServiceCompany = new ServiceCompanies({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Service companies array and include the Service company
			scope.serviceCompanies = [sampleServiceCompany];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/service-companies\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleServiceCompany);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.serviceCompanies.length).toBe(0);
		}));
	});
}());