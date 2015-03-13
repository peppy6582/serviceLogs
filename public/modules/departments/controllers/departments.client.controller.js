'use strict';

// Departments controller
angular.module('departments').controller('DepartmentsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Departments',
	function($scope, $stateParams, $location, Authentication, Departments) {
		$scope.authentication = Authentication;

		// Create new Department
		$scope.create = function() {
			// Create new Department object
			var department = new Departments ({
				name: this.department.name,
				contact: this.department.contact,
				email: this.department.email,
				address: this.department.address,
				city: this.department.city,
				state: this.department.state,
				postalCode: this.department.postalCode
			});

			// Redirect after save
			department.$save(function(response) {
				$location.path('departments/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Department
		$scope.remove = function(department) {
			if ( department ) { 
				department.$remove();

				for (var i in $scope.departments) {
					if ($scope.departments [i] === department) {
						$scope.departments.splice(i, 1);
					}
				}
			} else {
				$scope.department.$remove(function() {
					$location.path('departments');
				});
			}
		};

		// Update existing Department
		$scope.update = function() {
			var department = $scope.department;

			department.$update(function() {
				$location.path('departments/' + department._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Departments
		$scope.find = function() {
			$scope.departments = Departments.query();
		};

		// Find existing Department
		$scope.findOne = function() {
			$scope.department = Departments.get({ 
				departmentId: $stateParams.departmentId
			});
		};
	}
]);
