var browserDetectionController = angular.module('browserDetectionController', [ 'angularModalService', 'ServiceModule' ]);

browserDetectionController.controller('BrowserDetectionController', ['$scope', 'currentBrowser',
	function BrowserDetectionController($scope, currentBrowser) {
		$scope.currentBrowser = currentBrowser;
	}]);