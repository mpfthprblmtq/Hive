var publicModalController = angular.module('publicModalController', ['angularModalService']);

publicModalController.controller('AdminCredentialEntryController', ['$scope', '$http', 'ModalService', 'type',
	function AdminCredentialEntryController($scope, $http, ModalService, type) {

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
				if(data){

					// remove the error label if it is visible, just in case next time it is shown
					$("#errorLabel").attr("visibility", "hidden");

					// hide the modal
					$("#loginModal").modal('hide');

					if(type == "assisted"){
						var temp = sessionStorage.getItem('CheckoutUser')
						var checkoutUser = $.parseJSON(temp);

						$("#scanningDiv").html("<h3>Welcome, " + checkoutUser.name + "!</h3><p>Start scanning items to check out!</p>")
						$("#scanningInputDiv").show();

						// hide the modal
						$('#checkoutBeginModal').modal('hide')

						// hide button, and show greeting
						$("#beginDiv").hide();
						$("#scanningDiv").show();
						$("#itemToAdd").focus();
					} else if (type == "manualEntry") {
						$scope.showManualEntryOfUserModal();
					}
				}
				else // log in failed
				{
					// display the error message returned from the server
					$("#errorLabel").text(data);

					// set the error label to visible
					$("#errorLabel").attr("visibility", "visible");
				}
			}).error(function(data) { console.log(data)	});
		}

		$scope.showManualEntryOfUserModal = function(){

			// sets the focus to the text field
			$(document).ready(function() {
				setTimeout(function() {
					$("#userNameInput").focus();
				}, 500)
			})

			ModalService.showModal({
				templateUrl: "../../partials/public/modals/manualUserEntryModal.html",
				controller: "ManualEntryOfUserModalController"
			}).then(function(modal){
				modal.element.modal();

				modal.element.on('shown.bs.modal', function () {
				  	// remove residual modal elements
				  	$('<div class="modal-backdrop in"></div>').appendTo(document.body);
				});

				// actually close the modal (removes backdrop)
				modal.element.on('hidden.bs.modal', function () {
				  	// remove residual modal elements
				  	$('body').removeClass('modal-open');
					$('.modal-backdrop').remove();

					// destroy destroy destroy
					$(this).data('bs.modal', null);
					$(".modal").remove();
					$("#offset").remove();
				});

				modal.close.then(function(result){
					// empty
				});
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
	}]);

publicModalController.controller('ManualEntryOfUserModalController', ['$scope', '$http', '$route', 'ModalService',
	function ManualEntryOfUserModalController($scope, $http, $route, ModalService) {

		$scope.addNonCampusUser = function(name, phone, email, level){

			if(!validateInput())
				return;

				$http.post("../../php/User/AddNewUser.php",
					{
						"name" : name,
						"idNumber" : null,
						"cardNumber" : null,
						"phoneNumber" : phone,
						"email" : email,
						"selfServe" : 1
					}
				).success(function(data) {
					// set the user checking out in session storage
					var user = {'name' : name, 'email' : email};
					sessionStorage.setItem('CheckoutUser', JSON.stringify(user));
					var temp = sessionStorage.getItem('CheckoutUser')
					var checkoutUser = JSON.parse(temp);

					$("#scanningDiv").html("<h3>Welcome, " + name + "!</h3><p>Start scanning items to check out!</p>");
					$("#scanningInputDiv").show();

					// hide the modal
					$('#manualUserEntryModal').modal('hide')

					// hide button, and show greeting
					$("#beginDiv").hide();
					$("#scanningDiv").show();
					$("#itemToAdd").focus();
				}).error(function(data) { console.log(data)	});
			}// end addUser



		function validateInput(){
			var result = true;
			if($("#phoneNumberInput").val().length != 12){
				$("#phoneNumberInput").tooltip("show");
				result = false;
				return result;
			}else{
				$("#phoneNumberInput").tooltip("hide");
				result = true;
			}
			return result;
		}

		$(function(){
			$('#phoneNumberInput').keyup(function() {
		    this.value = this.value
		        .match(/\d*/g).join('')
		        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/).slice(1).join('-')
		        .replace(/-*$/g, '')
		    ;
			});
	});
	}]);

	publicModalController.controller('CheckoutBeginController', ['$scope', '$http', '$route', 'ModalService',
		function CheckoutBeginController($scope, $http, $route, ModalService) {

			$('#inputField').on('blur',function (event) { var blurEl = $(this); setTimeout(function() {blurEl.focus()},10) });

			var assisted = 1;

			// sets the focus to the text field
			$(document).ready(function() {
				setTimeout(function() {
					$("#inputField").focus();
				}, 500)
			})

			$scope.changeToAdminCredentialEntryModal = function(input) {
				$('#checkoutBeginModal').fadeOut(300, function() {
					$scope.showAdminCredentialEntryModal(input);
				});
			}

			$scope.showAdminCredentialEntryModal = function(input){

				ModalService.showModal({
					templateUrl: "../../partials/public/modals/adminCredentialEntryModal.html",
					controller: "AdminCredentialEntryController",
					inputs: { type : input }
				}).then(function(modal){
					modal.element.modal();

					// alert for admin assistance
					if(input == "assisted")
						$("#assistanceAlert").text("An Admin must log in to assist with this checkout.");

					// actually close the modal (removes backdrop)
					closeModal(modal);

					modal.close.then(function(result){

					})
				});
			}

			$scope.checkUser = function(input) {
				if(input != undefined && input != ""){
					var regex = new RegExp("^;([0-9]{16})=([0-9]{14})[?]");

					var isCougarCard = regex.test(input);

					if(isCougarCard) {
						// card scanned was a cougar card
						input = input.substring(1, 17);
						//$("#inputField").val(input);
						$("#inputField").val("");
						console.log(input)
					} else {
						$("#inputField").val("");
						$("#otherErrorLabel").css('visibility', 'visible');
						$("#otherErrorLabel").html("Card scanned was not a Cougar ID");
						console.log("card scanned was nawt a cougar card")
					}

					$http.post("../../php/User/CheckIfUserExists.php",
						{
							'input' : input
						}
					).success(function(data) {
						if(data){

							// set the user checking out in session storage
							sessionStorage.setItem('CheckoutUser', JSON.stringify(data));
							var temp = sessionStorage.getItem('CheckoutUser')
							var checkoutUser = $.parseJSON(temp);

							if(checkoutUser.selfServe == assisted){
								$scope.changeToAdminCredentialEntryModal("assisted");
							}else{

								$("#scanningDiv").html("<h3>Welcome, " + checkoutUser.name + "!</h3><p>Start scanning items to check out!</p>")
								$("#scanningInputDiv").show();

								// sets the focus to the text field
								$(document).ready(function() {
									setTimeout(function() {
										$("#itemToAdd").focus();
									}, 500)
								})


								// hide the modal
								$('#checkoutBeginModal').modal('hide')

								// hide button, and show greeting
								$("#beginDiv").hide();
								$("#scanningDiv").show();


							}
						}
						else // user doesn't exist
						{

							// display the error message
							$("#errorLabel").text("User not found");

							// set the error label to visible
							$("#errorLabel").attr("visibility", "visible");
						}
					}).error(function(data) {

					});
				}
				else if (input == undefined)
				{
					// display the error message
					$("#errorLabel").text("Please enter your email or 800 number");

					// set the error label to visible
					$("#errorLabel").attr("visibility", "visible");
				}
			}

			// function to close modals entirely
			function closeModal(modal) {
				$('#loginModal').on('hidden.bs.modal', function () {
				  	// remove residual modal elements
				  	$('body').removeClass('modal-open');
					$('.modal-backdrop').remove();

					// destroy destroy destroy
					$(this).data('bs.modal', null);
					$("#loginModal").remove();
				});
			}

		}]);

publicModalController.controller('PublicAlertModalController', ['$scope', '$http', '$route', 'ModalService', 'message', 'route',
	function PublicAlertModalController($scope, $http, $route, ModalService, message, route) {

		$scope.message = message;

		// sets the focus to the ok button
		$(document).ready(function() {
			setTimeout(function() {
				$("#alertOkButton").focus();
			}, 5)
		})

		$scope.routeAsNeeded = function(){
			if(route != ""){
				$(location).attr("href", route);
			}
		}
	}]);

publicModalController.controller('PublicHelpModalController', ['$scope', '$http', '$route', 'ModalService',
	function PublicHelpModalController($scope, $http, $route, ModalService) {

		$scope.showHomeText = function() {
			$("#searchText").hide();
			$("#checkinText").hide();
			$("#checkoutText").hide();
			$("#homeText").show();
		}

		$scope.showSearchText = function() {
			$("#homeText").hide();
			$("#checkoutText").hide();
			$("#checkinText").hide();
			$("#searchText").show();
		}

		$scope.showCheckoutText = function() {
			$("#homeText").hide();
			$("#searchText").hide();
			$("#checkinText").hide();
			$("#checkoutText").show();
		}

		$scope.showCheckinText = function() {
			$("#homeText").hide();
			$("#checkoutText").hide();
			$("#searchText").hide();
			$("#checkinText").show();
		}

	}]);
