var adminLoginController = angular.module('adminLoginController', [ 'angularModalService', 'ServiceModule' ]);

adminLoginController.controller('AdminLoginController', ['$scope', '$http', 'Auth',
	function AdminLoginController($scope, $http, Auth){

		// sets the focus to the text field
		$(document).ready(function() {
			setTimeout(function() {
				$("#800NumberInput").focus();
			}, 500)
		})

		//handle the login stuff here
		$scope.adminLogin = function(number, password){

			// check the credentials being passed in
			$http.post("../../php/User/PostCheckAdminCredentials.php",
				{
					'number' : number,
					'password' : password
				}
			).success(function(data) {
				if(data == "true"){
					// create a user object
					var user = { '800_number' : number }

					// store that user object in the session storage
					sessionStorage.setItem('currentUser', JSON.stringify(user));

					// remove the error label if it is visible, just in case next time it is shown
					$("#errorLabel").attr("visibility", "hidden");

					// hide the modal
					$("#loginModal").modal('hide');

					// redirect to the admin portal
					$(location).attr("href", "https://hive.isg.siue.edu/admin/")
					//$(location).attr("href", "http://hive.local/admin/")
				}
				else{ // log in failed
					// display the error message returned from the server
					$("#errorLabel").text(data);

					// set the error label to visible
					$("#errorLabel").attr("visibility", "visibile");
				}
			}).error(function(data) { console.log(data)	});
		}
	}]);
