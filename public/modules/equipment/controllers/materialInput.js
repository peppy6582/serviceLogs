'use strict';

angular.module('equipment')
    .controller('equipmentInputCtrl', function($scope) {
        $scope.equipment = {
            name: '',
            department: '',
            description: ''
        };
    })
    .config( function($mdThemingProvider){
        // Configure a dark theme with primary foreground light-green
        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('light-green')
            .dark();
    });
