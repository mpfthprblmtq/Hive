var publicBaseController = angular.module('publicBaseController', [ 'publicModalController', 'angularModalService',
	'adminLoginController', 'datatables', 'browserDetectionController', 'ServiceModule' ]);

publicBaseController.controller('PublicBaseController', ['$scope', '$http', '$route', '$rootScope', 'ModalService',
	function PublicBaseController($scope, $http, $route, $rootScope, ModalService){



		// show admin login modal
		$scope.showLoginModal = function(){
			$rootScope.$broadcast('adminModalClicked');
			ModalService.showModal({
				templateUrl: "../../partials/admin/modals/loginModal.html",
				controller: "AdminLoginController"
			}).then(function(modal){
				modal.element.modal();

				// actually close the modal (removes backdrop)
				modal.element.on('hidden.bs.modal', function () {
				  	// remove residual modal elements
				  	$('body').removeClass('modal-open');

						// focus on the inputs
						$rootScope.$broadcast('adminModalExited')
						$('#itemToAdd').focus();
					$('.modal-backdrop').remove();

					// destroy destroy destroy
					$(this).data('bs.modal', null);
					$(".modal").remove();
				});

				modal.close.then(function(result){

				})
			});
		}

		$scope.showHelpModal = function() {
			ModalService.showModal ({
				templateUrl: "../../partials/public/modals/helpModal.html",
				controller: "PublicHelpModalController"
			}).then(function(modal) {
				modal.element.modal();

				// actually close the modal (removes backdrop)
				modal.element.on('hidden.bs.modal', function () {
				  // remove residual modal elements
				  $('body').removeClass('modal-open');
					$('.modal-backdrop').remove();

					// destroy destroy destroy
					$(this).data('bs.modal', null);
					$(".modal").remove();
				});
			})
		}

		$scope.initController = function() {
			// determine what browser the user is currently using

			// Opera 8.0+
		    var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;

		    // Firefox 1.0+
		    var isFirefox = typeof InstallTrigger !== 'undefined';

		    // Safari 3.0+ "[object HTMLElementConstructor]"
		    var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || safari.pushNotification);

		    // Internet Explorer 6-11
		    var isIE = /*@cc_on!@*/false || !!document.documentMode;

		    // Edge 20+
		    var isEdge = !isIE && !!window.StyleMedia;

		    // Chrome 1+
		    var isChrome = !!window.chrome && !!window.chrome.webstore;

		    if(!isChrome) {
			    if(isOpera || isFirefox || isSafari || isIE || isEdge) {
			    	var currentBrowser;
			    	if(isOpera) {
			    		currentBrowser = "Opera";
			    	} else if (isFirefox) {
			    		currentBrowser = "Firefox";
			    	} else if (isSafari) {
			    		currentBrowser = "Safari";
			    	} else if (isIE) {
			    		currentBrowser = "Internet Explorer";
			    	} else if (isEdge) {
			    		currentBrowser = "Microsoft Edge";
			    	}

				} else {
					currentBrowser = "Unknown Browser";
				}
				$scope.showBrowserDetectionModal(currentBrowser);
			} else {
				// do nothing, user is using Chrome
			}
		}

		$scope.showBrowserDetectionModal = function(currentBrowser) {
			ModalService.showModal({
				templateUrl: "../../partials/public/modals/BrowserDetectionModal.html",
				controller: "BrowserDetectionController",
				inputs:{ currentBrowser : currentBrowser }
			}).then(function(modal){
				modal.element.modal();

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

				})
			});
		}

		$scope.initController();
	}]);

publicBaseController.controller('PublicHomeSearchController', ['$scope', '$http', '$route', 'ModalService',
	function PublicHomeSearchController($scope, $http, $route, ModalService){

		// set navbar to active
		$("#nav-search").addClass('active');
		$("#nav-checkout").removeClass('active');
		$("#nav-checkin").removeClass('active');

		// options for the angular datatable
		$scope.dtOptions = { paging: false, searching: false, oLanguage : {"sEmptyTable" : "There are currently no items in Hive Resource Manager!" } };

		$scope.initController = function() {

			// get all items for view
			$http.get("../../php/Item/GetItemDataForSearchView.php")
			.then(function(response){
				$scope.activeItems = response.data['activeItems'];

				if($scope.activeItems != undefined){
					//for (var i = $scope.activeItems.length - 1; i >= 0; i--) {
					for(i = 0; i < $scope.activeItems.length; i++) {
						$scope.activeItems[i]['itemIDNumber'] = pad($scope.activeItems[i]['itemIDNumber'], 6)
						if($scope.activeItems[i]['checkedOutUserEmail'] != null) {
							$scope.activeItems[i]['checkedOutUserEmail'] = "Not Available";
						} else {
							$scope.activeItems[i]['checkedOutUserEmail'] = "Available";
						}
						$scope.activeItems[i]['location'] = formatLocation(
							$scope.activeItems[i]['abbreviation'],
							$scope.activeItems[i]['roomIn'],
							$scope.activeItems[i]['shelfUnitIn'],
							$scope.activeItems[i]['shelfIn']);

						var singleSearchTag = "";
						for (j = 0; j < $scope.activeItems[i]['searchTags'].length; j++) {
							singleSearchTag += " " + $scope.activeItems[i]['searchTags'][j];
						}
						$scope.activeItems[i]['singleSearchTag'] = singleSearchTag;
					}
				}
			});
		}

		function pad(number, length) {
		    var padded = '' + number;
		    while (padded.length < length) {
		        padded = '0' + padded;
		    }
		    return padded;
		}

		function formatLocation(building, room, shelfUnit, shelf) {
			var formattedLocation = '';
			formattedLocation = building + room + ", " + shelfUnit + "-" + shelf;
			return formattedLocation;
		}

		$scope.initController();
	}]);

publicBaseController.controller('PublicCheckInController', ['$scope', '$http', '$route', '$rootScope', 'ModalService',
	function PublicCheckInController($scope, $http, $route, $rootScope, ModalService){

		var focusForModal = false;
		$('#itemToAdd').focus();

		$scope.$on('adminModalClicked', function(event, args) {
			focusForModal = true;
		});

		$scope.$on('adminModalExited', function(event, args) {
			focusForModal = false;
		});

		$('#loginModal').on('hidden.bs.modal', function () {
		    focusForModal = false;
		})

		$('#itemToAdd').on('blur',function (event) {
			if(focusForModal == false) {
				var blurEl = $(this); setTimeout(function() {blurEl.focus()},10)
			} else {
			}
		});



		// set navbar to active
		$("#nav-search").removeClass('active');
		$("#nav-checkout").removeClass('active');
		$("#nav-checkin").addClass('active');

		// options for the angular datatable
		$scope.dtOptions = { paging: false, searching: false, oLanguage : {"sEmptyTable" : "There are no items to check in" }} ;

		$scope.initController = function() {
			$scope.itemIds = [];
			$scope.itemsToCheckin = [];
			$scope.userEmail = "";
			disableCheckinButton(true);
			timeoutToHomeSearch();
		}

		$scope.cancelCheckIn = function() {
			//$(location).attr("href", "http://hive.local/");
			$(location).attr("href", "https://hive.isg.siue.edu/");
		}

		function disableCheckinButton(input){
			$("#checkinButton").attr("disabled", input);
		}

		$scope.inputItem = function(input) {
			$http.get("../../php/Item/GetFullActiveItemData.php",
				{ params:
					{ 'id': input }
				})
			.then(function(response){
				// check if the item exists
				if(response.data != undefined && response.data != "\"\""){
					// check if the item has already been scanned or is currently checked out
					if($.inArray(input, $scope.itemIds) == -1 || $scope.itemIds.length == 0){
						if(response.data.checkedOutUserEmail == null || response.data.checkedOutUserEmail == ""){
							// this item is already checked out
							$scope.showPublicAlertModal("This item is already checked in.", "");
						}else{
							disableCheckinButton(false);
							$scope.itemIds.push(response.data.itemIDNumber);
							$scope.itemsToCheckin.push({ "itemIDNumber" : response.data.itemIDNumber , "itemName" : response.data.itemName });
						}
					}else
						// this item is already addded
						$scope.showPublicAlertModal("This item is already added.", "");
				}else {
					// this item was not found
					$scope.showPublicAlertModal("This item is not found in the Hive system.  Please see an administrator.", "");
				}

				// reset the item to add textbox
				$("#itemToAdd").val("");

			});
		}

		$scope.checkIn = function(){
			// check in all of the scanned items
			$http.post("../../php/Item/PostCheckinItems.php",
				{
					"items" : $scope.itemIds
				}
			).success(function(data) {
				// on success, route to the home search view
				//$scope.showPublicAlertModal("You have successfully checked in " + $scope.itemIds.length + " item(s).", "http://hive.local/");
				$scope.showPublicAlertModal("You have successfully checked in " + $scope.itemIds.length + " item(s).", "http://hive.isg.siue.edu/");
				$scope.itemsToCheckin = [];
			}).error(function(data) { console.log(data)	});
		}

		$scope.showPublicAlertModal = function(input, route){
			ModalService.showModal({
				templateUrl: "../../partials/public/modals/publicAlertModal.html",
				controller: "PublicAlertModalController",
				inputs: { message : input, route : route }
			}).then(function(modal){
				modal.element.modal();

				// actually close the modal (removes backdrop)
				closeModal(modal);

				modal.close.then(function(result){

				})
			});
		}

		$scope.removeItemFromList = function(item) {
			$scope.itemsToCheckin.splice($scope.itemsToCheckin.indexOf(item), 1)
			$scope.itemIds.splice($scope.itemIds.indexOf(item.itemIDNumber), 1)
			if($scope.itemIds.length < 1)
				disableCheckinButton(true);
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

				setTimeout(function() {
					$("#itemToAdd").focus();
				}, 250)
			});
		}

		function timeoutToHomeSearch(){
			time = 0;
			// set interval to perform every second
			setInterval(function(){
				time += 1;
				// if we have gone three minutes
				if(time > 180){
					// route to the home search view
					sessionStorage.removeItem('CheckoutUser');
					//$(location).attr("href", "http://hive.local/");
					$(location).attr("href", "https://hive.isg.siue.edu/");
					$scope.itemsToCheckout = [];
				}
			}, 1000);
		}

		$scope.initController();
	}]);

publicBaseController.controller('PublicCheckOutController', ['$scope', '$http', '$route', 'ModalService',
	function PublicCheckOutController($scope, $http, $route, ModalService){

		var focusForModal = false;
		$('#itemToAdd').focus();

		$scope.$on('adminModalClicked', function(event, args) {
			focusForModal = true;
		});

		$scope.$on('adminModalExited', function(event, args) {
			focusForModal = false;
		});

		$('#loginModal').on('hidden.bs.modal', function () {
		    focusForModal = false;
		})

		$('#itemToAdd').on('blur',function (event) {
			if(focusForModal == false) {
				var blurEl = $(this); setTimeout(function() {blurEl.focus()},10)
			} else {
			}
		});

		// set navbar to active
		$("#nav-search").removeClass('active');
		$("#nav-checkout").addClass('active');
		$("#nav-checkin").removeClass('active');

		// options for the angular datatable
		$scope.dtOptions = { paging: false, searching: false, oLanguage : {"sEmptyTable" : "There are no items to check out" }} ;

		// this scope function will initialize the controller
		$scope.initController = function() {
			$scope.itemIds = [];
			$scope.itemsToCheckout = [];
			$scope.userEmail = "";
			disableCheckoutButton(true);
			timeoutToHomeSearch();
			$scope.showCheckoutBeginModal();
		}

		$scope.showCheckoutBeginModal = function(){
			ModalService.showModal({
				templateUrl: "../../partials/public/modals/checkoutBeginModal.html",
				controller: "CheckoutBeginController"
			}).then(function(modal){
				modal.element.modal();

				// actually close the modal (removes backdrop)
				closeModal(modal);

				modal.close.then(function(result){

				})
			});
		}

		$scope.inputItem = function(input) {
			$http.get("../../php/Item/GetFullActiveItemData.php",
				{ params:
					{ 'id': input }
				})
			.then(function(response){

				// check if the item exists
				if(response.data != undefined && response.data != "\"\""){
					// check if the item has already been scanned or is currently checked out
					if($.inArray(input, $scope.itemIds) == -1 || $scope.itemIds.length == 0){
						if(response.data.checkedOutUserEmail == null || response.data.checkedOutUserEmail == ""){
							disableCheckoutButton(false);
							$scope.itemIds.push(response.data.itemIDNumber);
							$scope.itemsToCheckout.push({ "itemIDNumber" : response.data.itemIDNumber , "itemName" : response.data.itemName });
						}else
							// this item is already checked out
							$scope.showPublicAlertModal("This item is still checked out.  Please check the item back in to continue.", "");
					}else
						// this item is already addded
						$scope.showPublicAlertModal("This item is already added.", "");
				}else {
					// this item was not found
					$scope.showPublicAlertModal("This item is not found in the Hive system.  Please see an administrator.", "");
				}

				// reset the item to add textbox
				$("#itemToAdd").val("");

			});
		}

		$scope.showPublicAlertModal = function(input, route){
			ModalService.showModal({
				templateUrl: "../../partials/public/modals/publicAlertModal.html",
				controller: "PublicAlertModalController",
				inputs: { message : input, route : route }
			}).then(function(modal){
				modal.element.modal();

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

				setTimeout(function() {
					$("#itemToAdd").focus();
				}, 250)
			});
		}

		$scope.checkOut = function(){
			// this function will take the user ID and the IDs of all items that are being checked
			// out and associate them to the user
			// this function should also route to the HomeSearch view after success
			var temp = sessionStorage.getItem('CheckoutUser')
			var checkoutUser = JSON.parse(temp);

			// check out all of the requested items

			$http.post("../../php/Item/PostCheckOutItems.php",
				{
					"items" : $scope.itemIds,
					"userEmail" : checkoutUser.email
				}
			).success(function(data) {
				// on success, route to the home search view
				//$scope.showPublicAlertModal("You have successfully checked out " + $scope.itemIds.length + " item(s).", "http://hive.local/");
				$scope.showPublicAlertModal("You have successfully checked out " + $scope.itemIds.length + " item(s).", "http://hive.isg.siue.edu/");
				$scope.itemsToCheckout = [];
			}).error(function(data) { console.log(data)	});
		}

		$scope.cancelCheckout = function() {
			//$(location).attr("href", "http://hive.local/");
			$(location).attr("href", "https://hive.isg.siue.edu/");
		}

		function disableCheckoutButton(input){
			$("#checkoutButton").attr("disabled", input);
		}

		$scope.removeItemFromList = function(item) {
			$scope.itemsToCheckout.splice($scope.itemsToCheckout.indexOf(item), 1);
			$scope.itemIds.splice($scope.itemIds.indexOf(item.itemIDNumber), 1);
			if($scope.itemIds.length < 1)
				disableCheckoutButton(true);
		}

		function timeoutToHomeSearch(){
			time = 0;
			// set interval to perform every second
			setInterval(function(){
				time += 1;
				// if we have gone three minutes
				if(time > 180){
					// route to the home search view
					sessionStorage.removeItem('CheckoutUser');
					//$(location).attr("href", "http://hive.local/");
					$(location).attr("href", "https://hive.isg.siue.edu/");
					$scope.itemsToCheckout = [];
				}
			}, 1000);
		}

		$scope.initController();
	}]);
