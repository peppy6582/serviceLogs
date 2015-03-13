'use strict';

// Equipment controller
angular.module('equipment').controller('EquipmentController', ['$scope', '$stateParams', '$location', 'Authentication', 'Equipment', 'Departments',
	function($scope, $stateParams, $location, Authentication, Equipment, Departments) {
		$scope.authentication = Authentication;

		// Create new Equipment
		$scope.create = function() {
			// Create new Equipment object
			var equipment = new Equipment ({
				name: this.equipment.name,
				department: this.equipment.department,
				description: this.equipment.description
			});

			// Redirect after save
			equipment.$save(function(response) {
				$location.path('equipment/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Equipment
		$scope.remove = function(equipment) {
			if ( equipment ) { 
				equipment.$remove();

				for (var i in $scope.equipment) {
					if ($scope.equipment [i] === equipment) {
						$scope.equipment.splice(i, 1);
					}
				}
			} else {
				$scope.equipment.$remove(function() {
					$location.path('equipment');
				});
			}
		};

		// Update existing Equipment
		$scope.update = function() {
			var equipment = $scope.equipment;

			equipment.$update(function() {
				$location.path('equipment/' + equipment._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Equipment
		$scope.find = function() {
			$scope.equipment = Equipment.query();
		};

		// Find existing Equipment
		$scope.findOne = function() {
			$scope.equipment = Equipment.get({ 
				equipmentId: $stateParams.equipmentId
			});
		};

		// Find a list of Departments
		$scope.findDepartments = function() {
			$scope.departments = Departments.query();
		};

		$scope.data = {
			cb1: true
		};

		$scope.onChange = function(cbState){
			$scope.message = "The switch is now: " + cbState;
		};

		var section = 1;

		$scope.section = function (id) {
			section = id;
		};

		$scope.is = function (id) {
			return section == id;
		};

	}

])

