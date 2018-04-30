'use strict';

var hiveAdminApp = angular.module('hiveAdminApp', [ 'ngRoute', 'adminBaseController', 'adminDashboardController',
	'adminInventoryController', 'adminReportController', 'adminUserController', 'angularModalService', 'ServiceModule' ]);

hiveAdminApp.config(['$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider){
		$routeProvider.
			when('/admin/', {
				templateUrl: '../partials/admin/dashboard.html',
				controller: 'AdminDashboardController'
			}).
			when('/admin/addItem', {
				templateUrl: '../partials/admin/inventory/addItem.html',
				controller: 'AddItemController'
			}).
			when('/admin/viewAllActiveItems', {
				templateUrl: '../partials/admin/inventory/allActiveItems.html',
				controller: 'ViewAllActiveItemsController'
			}).
			when('/admin/viewAllDisposedItems', {
				templateUrl: '../partials/admin/inventory/allDisposedItems.html',
				controller: 'ViewAllDisposedItemsController'
			}).
			when('/admin/viewAllLocations', {
				templateUrl: '../partials/admin/inventory/allLocations.html',
				controller: 'ViewAllLocationsController'
			}).
			when('/admin/addUser', {
				templateUrl: '../partials/admin/users/addUser.html',
				controller: 'AddUserController'
			}).
			when('/admin/viewAllUsers', {
				templateUrl: '../partials/admin/users/allUsers.html',
				controller: 'ViewAllUsersController'
			}).
			when('/admin/addAdmin', {
				templateUrl: '../partials/admin/users/addAdmin.html',
				controller: 'AddAdminController'
			}).
			when('/admin/inventoryReports', {
				templateUrl: '../partials/admin/reports/inventoryReports.html',
				controller: 'InventoryReportController'
			}).
			when('/admin/userReports', {
				templateUrl: '../partials/admin/reports/userReports.html',
				controller: 'UserReportController'
			});
			$locationProvider.html5Mode({ enabled:true, requireBase: false });
	}]);

hiveAdminApp.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function (event) {
    	// CHECKS TO SEE IF A USER IS LOGGED IN
        if (!Auth.isLoggedIn()) {
            console.log('DENY ACCESS');
            event.preventDefault();
            //$(location).attr("href", "/")
            $(location).attr("href", "https://hive.isg.siue.edu")
        }
    });
}]);
