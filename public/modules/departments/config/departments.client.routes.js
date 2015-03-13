'use strict';

//Setting up route
angular.module('departments').config(['$stateProvider',
	function($stateProvider) {
		// Departments state routing
		$stateProvider.
		state('listDepartments', {
			url: '/departments',
			templateUrl: 'modules/departments/views/list-departments.client.view.html'
		}).
		state('createDepartment', {
			url: '/departments/create',
			templateUrl: 'modules/departments/views/create-department.client.view.html'
		}).
		state('viewDepartment', {
			url: '/departments/:departmentId',
			templateUrl: 'modules/departments/views/view-department.client.view.html'
		}).
		state('editDepartment', {
			url: '/departments/:departmentId/edit',
			templateUrl: 'modules/departments/views/edit-department.client.view.html'
		});
	}
]);