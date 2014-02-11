'use strict';

var taskManager = angular.module('taskManagerApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap'
]);

taskManager.config(function ($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
    }).
    when('/sub', {
        templateUrl: 'views/sub.html',
        controller: 'SubCtrl'
    }).
    otherwise({
        redirectTo: '/'
    });
});
