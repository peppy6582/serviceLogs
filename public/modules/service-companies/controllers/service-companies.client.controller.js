'use strict';

// Service companies controller
angular.module('service-companies').controller('ServiceCompaniesController', ['$scope', '$stateParams', '$location', 'Authentication', 'ServiceCompanies',
	function($scope, $stateParams, $location, Authentication, ServiceCompanies) {
		$scope.authentication = Authentication;

		// Create new Service company
		$scope.create = function() {
			// Create new Service company object
			var serviceCompany = new ServiceCompanies ({
				name: this.name
			});

			// Redirect after save
			serviceCompany.$save(function(response) {
				$location.path('service-companies/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Service company
		$scope.remove = function(serviceCompany) {
			if ( serviceCompany ) { 
				serviceCompany.$remove();

				for (var i in $scope.serviceCompanies) {
					if ($scope.serviceCompanies [i] === serviceCompany) {
						$scope.serviceCompanies.splice(i, 1);
					}
				}
			} else {
				$scope.serviceCompany.$remove(function() {
					$location.path('service-companies');
				});
			}
		};

		// Update existing Service company
		$scope.update = function() {
			var serviceCompany = $scope.serviceCompany;

			serviceCompany.$update(function() {
				$location.path('service-companies/' + serviceCompany._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Service companies
		$scope.find = function() {
			$scope.serviceCompanies = ServiceCompanies.query();
		};

		// Find existing Service company
		$scope.findOne = function() {
			$scope.serviceCompany = ServiceCompanies.get({ 
				serviceCompanyId: $stateParams.serviceCompanyId
			});
		};
	}
]);