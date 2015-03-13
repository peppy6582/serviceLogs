'use strict';

// Service logs controller
angular.module('service-logs').controller('ServiceLogsController', ['$scope', '$stateParams', '$location', 'Authentication', 'ServiceLogs',
	function($scope, $stateParams, $location, Authentication, ServiceLogs) {
		$scope.authentication = Authentication;

		// Create new Service log
		$scope.create = function() {
			// Create new Service log object
			var serviceLog = new ServiceLogs ({
				name: this.name
			});

			// Redirect after save
			serviceLog.$save(function(response) {
				$location.path('service-logs/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Service log
		$scope.remove = function(serviceLog) {
			if ( serviceLog ) { 
				serviceLog.$remove();

				for (var i in $scope.serviceLogs) {
					if ($scope.serviceLogs [i] === serviceLog) {
						$scope.serviceLogs.splice(i, 1);
					}
				}
			} else {
				$scope.serviceLog.$remove(function() {
					$location.path('service-logs');
				});
			}
		};

		// Update existing Service log
		$scope.update = function() {
			var serviceLog = $scope.serviceLog;

			serviceLog.$update(function() {
				$location.path('service-logs/' + serviceLog._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Service logs
		$scope.find = function() {
			$scope.serviceLogs = ServiceLogs.query();
		};

		// Find existing Service log
		$scope.findOne = function() {
			$scope.serviceLog = ServiceLogs.get({ 
				serviceLogId: $stateParams.serviceLogId
			});
		};
	}
]);