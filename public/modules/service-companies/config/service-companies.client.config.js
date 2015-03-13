'use strict';

// Configuring the Articles module
angular.module('service-companies').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Service companies', 'service-companies', 'dropdown', '/service-companies(/create)?');
		Menus.addSubMenuItem('topbar', 'service-companies', 'List Service companies', 'service-companies');
		Menus.addSubMenuItem('topbar', 'service-companies', 'New Service company', 'service-companies/create');
	}
]);