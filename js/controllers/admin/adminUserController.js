var adminUserController = angular.module('adminUserController', ['datatables' , 'adminModalController', 'angularModalService' ]);

adminUserController.controller('AddAdminController', ['$scope', '$http', '$route',
	function AddAdminController($scope, $http, $route){

		// function to initialize the controller
		$scope.initController = function(){
			if(sessionStorage.lastAdminAdded != undefined && sessionStorage.lastAdminAdded != "") {
				$("#resultHTML").html("<div class=\"alert alert-success fade in alert-dismissable\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Success!</strong>  " + sessionStorage.lastAdminAdded + " was added as an administrator!</div>");
			} else {
				$("#resultHTML").html("");
			}
			sessionStorage.lastUserAdded = "";
		}// end initController

		$scope.newAdmin = function(name, email, username, password) {
			$http.post("../../php/User/NewAdmin.php",
				{
					"name" : name,
					"email" : email,
					"800number" : username,
					"password" : password
				}
			).success(function(data) {

				sessionStorage.lastAdminAdded = name;

				$route.reload();
				$("#resultHTML").html("<div class=\"alert alert-success fade in alert-message\" style=\"text-align: left;\"><strong>Success!</strong>  " + name + " was added as an administrator!</div>");
			});
		}

		$scope.initController();
	}]);

adminUserController.controller('AddUserController', ['$scope',  '$http', '$route', 'ModalService',
	function AddUserController($scope, $http, $route, ModalService){

		// function to initialize the controller
		$scope.initController = function(){
			if(sessionStorage.lastUserAdded != undefined && sessionStorage.lastUserAdded != "") {
				$("#resultHTML").html("<div class=\"alert alert-success fade in alert-dismissable\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Success!</strong>  " + sessionStorage.lastUserAdded + " was added!</div>");
			} else {
				$("#resultHTML").html("");
			}
			sessionStorage.lastUserAdded = "";
		}// end initController

		$scope.addUser = function(info){

			if(!validateInput())
				return;

			info.cNumber = $("#cardNumber").val();

			console.log(info.cNumber)

			$http.post("../../php/User/AddNewUser.php",
				{
					"name" : info.name,
					"idNumber" : info.uNumber,
					"cardNumber" : info.cNumber,
					"phoneNumber" : info.phoneNumber,
					"email" : info.email,
					"selfServe" : parseInt(info.userLevel)

				}
			).success(function(data) {
				// store the last user name in session to use in the success message
				sessionStorage.lastUserAdded = info.name;

				$route.reload(); // reload the route
			}).error(function(data) { console.log(data)	});
		}// end addUser

		function validateInput(){
			var result = true;
			// user name
			if($("#userNameInput").val() == ""){
				$("#userNameInput").tooltip("show");
				result = false;
				return result;
			}else{
				$("#userNameInput").tooltip("hide");
				result = true;
			}
			// phone number
			if($("#phoneNumberInput").val().length != 12){
				$("#phoneNumberInput").tooltip("show");
				result = false;
				return result;
			}else{
				$("#phoneNumberInput").tooltip("hide");
				result = true;
			}
			// email
			var test = $("#emailInput").val();
			if($("#emailInput").val() == "" || !emailRegex.test(test)){
				$("#emailInput").tooltip("show");
				result = false;
				return result;
			}else{
				$("#emailInput").tooltip("hide");
				result = true;
			}
			// 800 #
			if($("#uNumberInput").val().length != 9){
				$("#uNumberInput").tooltip("show");
				result = false;
				return result;
			}else{
				$("#uNumberInput").tooltip("hide");
				result = true;
			}
			// user type
			var test = $("#userLevelInput option:selected").val();
			if($("#userLevelInput option:selected").val() == ""){
				$("#userLevelInput").tooltip("show");
				result = false;
				return result;
			}else{
				$("#userLevelInput").tooltip("hide");
				result = true;
			}
			// 16-digit card #
			if($("#cardNumber").val().length != 16){
				$("#cardNumber").tooltip("show");
				result = false;
				return result;
			}else{
				$("#cardNumber").tooltip("hide");
				result = true;
			}

			return result;
		}

		$("#phoneNumberInput").keyup(function() {
		    this.value = this.value
		        .match(/\d*/g).join('')
		        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/).slice(1).join('-')
		        .replace(/-*$/g, '')
		    ;
		});

		var emailRegex = new RegExp('(.+)@(.+){2,}\.(.+){2,}');

		$scope.showAddUserSwipeModal = function(){
			ModalService.showModal({
				templateUrl: "../../partials/admin/users/modals/addUserSwipeModal.html",
				controller: "AddUserSwipeModalController",
				inputs:{  }
			}).then(function(modal){
				//$rootScope.$broadcast('edModalShown');

				modal.element.modal();

				// actually close the modal (removes backdrop)
				//closeModal(modal);

				modal.close.then(function(result){

				})
			});
		}

		// function to close modals entirely
		function closeModal(modal) {
			modal.element.on('hidden.bs.modal', function () {
			  	// remove residual modal elements
			  	$('body').removeClass('modal-open');
				$('.modal-backdrop').remove();

				// destroy destroy destroy
				$(this).data('bs.modal', null);
				$(".modal").remove();
				$("#offset").remove();

			});
		}

		$scope.initController();
	}]);

adminUserController.controller('ViewAllUsersController', ['$scope', '$rootScope', '$http', 'ModalService',
	function ViewAllUsersController($scope, $rootScope, $http, ModalService){

		// options for the angular datatable
		$scope.dtOptions = { paging: true, searching: true,
			oLanguage : {"sEmptyTable" : "There are currently no users in the system!  Click <a href=\"https://hive.isg.siue.edu/admin/addUser\">here</a> to add users." } };


		// function to initialize the controller
		$scope.initController = function(){
			// get all users
			$http.get("../../php/User/GetAllUsers.php")
			.then(function(response){
				$scope.activeUsers = response.data['activeUsers'];
			});

			if(sessionStorage.lastUserRemoved != undefined && sessionStorage.lastUserRemoved != "") {
				$("#resultHTML").html("<div class=\"alert alert-success fade in alert-message\" style=\"text-align: left;\"><strong>Success!</strong>  Hive user with 800#: "
					+ sessionStorage.lastUserRemoved + " was successfully removed!</div>");
			} else {
				$("#resultHTML").html("");
			}
			sessionStorage.lastUserRemoved = "";

			if(sessionStorage.lastUserEdited != undefined && sessionStorage.lastUserEdited != "") {
				$("#resultHTML").html("<div class=\"alert alert-success fade in alert-message\" style=\"text-align: left;\"><strong>Success!</strong>  Hive user with email: "
					+ sessionStorage.lastUserEdited + " was successfully updated!</div>");
			} else {
				$("#resultHTML").html("");
			}
			sessionStorage.lastUserEdited = "";
		}// end initController

		/*$scope.editUser = function(email, numItems) {
			if (numItems > 0) {
				$scope.showAdminAlertModal("User cannot be edited with items still checked out", "");
			} else {
				$scope.showEditUserModal(email);
			}
		}*/

		$scope.showEditUserModal = function(email){
			ModalService.showModal({
				templateUrl: "../../partials/admin/users/modals/editUserModal.html",
				controller: "EditUserModalController",
				inputs:{ email : email }
			}).then(function(modal){
				$rootScope.$broadcast('editUserModalShown');

				modal.element.modal();

				// actually close the modal (removes backdrop)
				closeModal(modal);

				modal.close.then(function(result){

				})
			});
		}

		$scope.showUserInfoModal = function(email){
			ModalService.showModal({
				templateUrl: "../../partials/admin/users/modals/userInfoModal.html",
				controller: "UserInfoModalController",
				inputs: { email : email }
			}).then(function(modal){
				modal.element.modal();

				// actually close the modal (removes backdrop)
				closeModal(modal);

				modal.close.then(function(result){

				})
			});
		}

		$scope.deleteUser = function(email, numItems) {
			if (numItems > 0) {
				$scope.showAdminAlertModal("User cannot be deleted with items still checked out", "");
			} else {
				$scope.showDeleteUserModal(email);
			}
		}

		$scope.showDeleteUserModal = function(email){
			ModalService.showModal({
				templateUrl: "../../partials/admin/users/modals/deleteUserModal.html",
				controller: "DeleteUserModalController",
				inputs:{ email : email }
			}).then(function(modal){
				modal.element.modal();

				// do stuff

				// actually close the modal (removes backdrop)
				closeModal(modal);

				modal.close.then(function(result){

				})
			});
		}

		$scope.showAdminAlertModal = function(input, route){
			ModalService.showModal({
				templateUrl: "../../partials/admin/modals/adminAlertModal.html",
				controller: "AdminAlertModalController",
				inputs: { message : input, route : route }
			}).then(function(modal){
				modal.element.modal();

				// actually close the modal (removes backdrop)
				closeModal(modal);

				modal.close.then(function(result){

				})
			});
		}

		$scope.showEmailUserModal = function(name, email){
			ModalService.showModal({
				templateUrl: "../../partials/admin/users/modals/emailUserModal.html",
				controller: "EmailUserModalController",
				inputs:{ name : name,
					email : email }
			}).then(function(modal){
				modal.element.modal();

				// do stuff

				// actually close the modal (removes backdrop)
				closeModal(modal);

				modal.close.then(function(result){

				})
			});
		}

		// function to close modals entirely
		function closeModal(modal) {
			modal.element.on('hidden.bs.modal', function () {
			  	// remove residual modal elements
			  	$('body').removeClass('modal-open');
				$('.modal-backdrop').remove();

				// destroy destroy destroy
				$(this).data('bs.modal', null);
				$(".modal").remove();
				$("#offset").remove();
				try {
				    $rootScope.$broadcast('editUserModalClosed');
				}
				catch(err) {
				    console.log(err.message + " don't worry be happy");
				}
			});
		}

		$scope.initController();
	}]);
