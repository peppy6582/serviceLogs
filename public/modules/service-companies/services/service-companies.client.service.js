'use strict';

//Service companies service used to communicate Service companies REST endpoints
angular.module('service-companies').factory('ServiceCompanies', ['$resource',
	function($resource) {
		return $resource('service-companies/:serviceCompanyId', { serviceCompanyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);