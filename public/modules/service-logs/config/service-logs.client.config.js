'use strict';

// Configuring the Articles module
angular.module('service-logs').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Service logs', 'service-logs', 'dropdown', '/service-logs(/create)?');
		Menus.addSubMenuItem('topbar', 'service-logs', 'List Service logs', 'service-logs');
		Menus.addSubMenuItem('topbar', 'service-logs', 'New Service log', 'service-logs/create');
	}
]);