'use strict';

var hiveApp = angular.module('hiveApp',[ 'ngRoute', 'publicBaseController', 'angularModalService', 'ServiceModule']);

hiveApp.config(['$routeProvider', '$locationProvider', 
	function($routeProvider, $locationProvider){
		$routeProvider.
			when('/', {
				templateUrl: '../partials/public/homeSearch.html',
				controller: 'PublicHomeSearchController'
			}).
			when('/checkin', {
				templateUrl: '../partials/public/checkin.html',
				controller: 'PublicCheckInController'
			}).
			when('/checkout', {
				templateUrl: '../partials/public/checkout.html',
				controller: 'PublicCheckOutController'
			});
		$locationProvider.html5Mode({ enabled:true, requireBase: false });
	}]);

