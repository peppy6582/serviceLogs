'use strict';

//Service logs service used to communicate Service logs REST endpoints
angular.module('service-logs').factory('ServiceLogs', ['$resource',
	function($resource) {
		return $resource('service-logs/:serviceLogId', { serviceLogId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);