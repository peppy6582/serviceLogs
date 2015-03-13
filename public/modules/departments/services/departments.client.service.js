'use strict';

//Departments service used to communicate Departments REST endpoints
angular.module('departments').factory('Departments', ['$resource',
	function($resource) {
		return $resource('departments/:departmentId', { departmentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);