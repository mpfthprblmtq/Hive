var adminBaseController = angular.module('adminBaseController', [ 'adminModalController', 'angularModalService' ]);

adminBaseController.controller('AdminBaseController', ['$scope', 'ModalService',
	function AdminBaseController($scope, ModalService){

		// this is an initializer function for the partial view
		$scope.init = function () {

			// go ahead and initialize the MetisMenu JS plugin
			$('#menu').metisMenu();

			// here we are using a session storage item in the browser to
			// track which menu item is being used; this is important for
			// when the page is reloaded; the menu will reflect what was last
			// used by the user by storing the id of that menu element in the
			// session storage 'activeMenu'
			if(sessionStorage.activeMenu != "undefined" && sessionStorage.activeMenu != ""){
				$("#" + sessionStorage.activeMenu).addClass("active");
				$("#" + sessionStorage.activeMenu).parent().parent().addClass("active");
				$("#" + sessionStorage.activeMenu).closest("ul").attr("aria-expanded", true);
				$("#" + sessionStorage.activeMenu).closest("ul").addClass("in");
			}else{
				sessionStorage.activeMenu = "dashboard";
			}

			// event listener for a selection on the menu
			$("#menu .select").click(function(e){
				 if($(this).attr("id") == "dashboard"){
				 	$("#" + sessionStorage.activeMenu).removeClass("active");
				 	$("#" + sessionStorage.activeMenu).parent().parent().removeClass("active");
				 	$("#" + sessionStorage.activeMenu).closest("ul").attr("aria-expanded", false);
					$("#" + sessionStorage.activeMenu).parent().removeClass("in");
				 }
		      	sessionStorage.activeMenu = $(this).attr("id");
			}); // end #menu .select click()
		}

		// basic logout functionality ( eventually a modal )
		$scope.showLogoutModal = function(){
			// set the current user session storage item to ""
			sessionStorage.currentUser = "";

			// redirect back to the public page
			$(location).attr("href", "http://hive.isg.siue.edu/")
			//$(location).attr("href", "http://hive.local")
		}

		// open up a new browser window with the PDF version Hive user manual
		$scope.showUserManual = function(){
			window.open('../../doc/Hive Resource Manager Operator Manual.pdf','_blank');
		}

		$scope.showBugReportModal = function() {
			ModalService.showModal({
				templateUrl: "../../partials/admin/settings/bugModal.html",
				controller: "BugModalController"
			}).then(function(modal){
				// show the modal
				modal.element.modal();

				modal.element.on('hidden.bs.modal', function () {
				  	// remove residual modal elements
				  	$('body').removeClass('modal-open');
					$('.modal-backdrop').remove();

					// destroy destroy destroy
					$(this).data('bs.modal', null);
					$(".modal").remove();
				});

				modal.close.then(function(result){
					//empty
				});
			});
		}

		$scope.showSuggestionModal = function() {
			ModalService.showModal({
				templateUrl: "../../partials/admin/settings/suggestionModal.html",
				controller: "SuggestionModalController"
			}).then(function(modal){
				// show the modal
				modal.element.modal();

				modal.element.on('hidden.bs.modal', function () {
				  	// remove residual modal elements
				  	$('body').removeClass('modal-open');
					$('.modal-backdrop').remove();

					// destroy destroy destroy
					$(this).data('bs.modal', null);
					$(".modal").remove();
				});

				modal.close.then(function(result){
					//empty
				});
			});
		}

	}]);
