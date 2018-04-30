'use strict';

var serviceModule = angular.module('ServiceModule', []);

// Auth is a factory service that is usable across all of the modules
// to check if a user is logged in or not
serviceModule.factory('Auth', function(){
	return{
    	isLoggedIn : function(){
        	return(sessionStorage.currentUser)? sessionStorage.currentUser : false;
    	}
  	}
});