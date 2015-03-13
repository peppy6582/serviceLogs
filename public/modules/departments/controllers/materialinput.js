/**
 * Created by pberryman on 3/11/2015.
 */
'use strict';

angular.module('departments')
    .controller('departmentInputCtrl', function($scope) {
        $scope.department = {
            name: '',
            contact: '',
            email: '',
            address: '' ,
            city: '' ,
            state: '' ,
            postalCode : ''
        };
    })
    .config( function($mdThemingProvider){
        // Configure a dark theme with primary foreground light-green
        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('light-green')
            .dark();
    });
