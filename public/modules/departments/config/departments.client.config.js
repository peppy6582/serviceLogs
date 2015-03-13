'use strict';

// Configuring the Departments module
angular.module('departments').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Departments', 'departments', 'dropdown', '/departments(/create)?');
		Menus.addSubMenuItem('topbar', 'departments', 'List Departments', 'departments');
		Menus.addSubMenuItem('topbar', 'departments', 'New Department', 'departments/create');
	}
]);
