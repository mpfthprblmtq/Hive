var adminInventoryController = angular.module('adminInventoryController', ['datatables' , 'adminModalController', 'angularModalService' ]);

adminInventoryController.controller('AddItemController', ['$scope', '$http', '$route', 'ModalService',
	function AddItemController($scope, $http, $route, ModalService){

		var lastItemAdded = "";

		// these will either always change or stay the same
		// well that's pretty generic, dontcha think
		$scope.numItems = 0;
		$scope.location;
		$scope.categories;
		$scope.buildings;
		$scope.departments;

		// set of arrays to run parallel for adding event listeners
		// and setting properties of elements in the html code AND
		// setting sessionStorage items
		var InputTagArr = [
			"buildingInput",
			"roomInput",
			"shelfUnitInput",
			"shelfInput",
			"departmentInput"
		];

		var ListTagArr = [
			$('#buildingList'),
			$('#roomList'),
			$('#shelfUnitList'),
			$('#shelfList'),
			$('#departmentList')
		];

		var FuncArr = [
			getRoomsForBuilding,
			getShelfUnitsForRoom,
			getShelvesForShelfUnit
		];

		// this function is the initializer for the page controlled
		// by this specific controller.  this function is called at
		// the very end of this script.  the functions herein are
		// commented individually
		$scope.initController = function() {

			// get all locations
			$http.get("../../php/Location/GetAllLocationData.php")
			.then(function(response){
				$scope.location = JSON.parse(JSON.stringify(response.data));
				$scope.buildings = $scope.location["buildings"];

				//  go ahead and set the previous selections if any
				getPreviousSelectionsAndOptions();
				for(var i = 0; i < InputTagArr.length; ++i){
					$("#" + InputTagArr[i]).trigger('input');
				}
			});

			// get all categories
			$http.get("../../php/Item/GetItemCategories.php")
			.then(function(response){
				$scope.categories = response.data;
			});

			// get all departments (may change to only show admin assigned depts later on)
			$http.get("../../php/Location/GetAllDepartments.php")
			.then(function(response){
				$scope.departments = response.data;
			});

			// this is a GET request for getting the count of items in the
			// print queue; the print button is set as disabled if there
			// are no items in the print queue
		    $http.get("../../php/Print/GetPrintDataCount.php",
				{ params:
					{ '800number': '800'}
				})
				.then(function(response){
					$scope.numItems = response.data;
					$("input[name='printButton']").prop("disabled", $scope.numItems == 0);
			}); // end get()

			if(sessionStorage.lastItemAdded != undefined && sessionStorage.lastItemAdded != "") {
				$("#resultHTML").html("<div class=\"alert alert-success fade in alert-dismissable\"><a href=\"#\" class=\"close\" data-dismiss=\"alert\" aria-label=\"close\">&times;</a><strong>Success!</strong>  " + sessionStorage.lastItemAdded + " was added!</div>");
			} else {
				$("#resultHTML").html("");
			}
			sessionStorage.lastItemAdded = "";

			// initialize the event listeners for the datalists
			initDataListListeners();
		}

		// this function initializes all of the event listeners
		// for the datalists contained in the page; this function
		// utilizes the parallel arrays above
		function initDataListListeners(){
			for(var i = 0; i < InputTagArr.length - 2; ++i){
				var element = document.getElementById(InputTagArr[i]);
				element.addEventListener('input', getDataListOptions, false);
				element.index = i;
			}
		}

		// this function is called in the event listener for each
		// of the datalists; if the option that is selected in a
		// datalist is found then the function to populate the next
		// datalist is called and its options are appended; if the option
		// is not found, then the options for the next datalist are either
		// disabled and cleared or just cleared
		function getDataListOptions(e){
			var val = this.value;
		    if(ListTagArr[e.target.index].find('option').filter(function(){
		        return this.value.toUpperCase() === val.toUpperCase();
		    }).length) {
		        FuncArr[e.target.index](val);
		    }else if(this.value.length > 0){
		    	clearInput(e.target.index + 1);
		    	enableInput(e.target.index + 1);
		    	if(e.target.index + 1 < InputTagArr.length - 1)
		    		disableInput(e.target.index + 2);
		    }else{
		    	clearInput(e.target.index + 1);
		    	if(e.target.index < InputTagArr.length - 1)
		    		disableInput(e.target.index + 1);
		    }
		}

		// this function clears the input element it is being called on
		function clearInput(index){
			while(index < InputTagArr.length - 1){
				$("#" + InputTagArr[index]).val("");
				ListTagArr[index].empty();
				index++;
			}
		}

		// this function disables the input element it is being called on
		function disableInput(index){
			while(index < InputTagArr.length - 1){
				$("#" + InputTagArr[index]).prop("disabled", true);
				index++;
			}
		}

		// this function enables the input element it is being called on
		function enableInput(index){
			if(index < InputTagArr.length - 1)
				$("#" + InputTagArr[index]).prop("disabled", false);
		}

		// this function gets all the rooms for a building
		function getRoomsForBuilding(value){
			$("#roomInput").prop("disabled", false);
			$("#roomList").empty();
			$scope.rooms = $scope.location["rooms"][value];
			for(var i = 0; i < $scope.rooms.length; ++i){
				$("#roomList").append("<option>" + $scope.rooms[i] + "</option>");
			}
		}

		// this function gets all the shelf units for a room
		function getShelfUnitsForRoom(value){
			$("#shelfUnitInput").prop("disabled", false);
			$("#shelfUnitList").empty();
			$scope.shelfUnits = $scope.location["shelfunits"][$("#buildingInput").val()][value];
			for(var i = 0; i < $scope.shelfUnits.length; ++i){
				$("#shelfUnitList").append("<option>" + $scope.shelfUnits[i] + "</option>");
			}
		}

		// this function gets all the shelves for a shelf unit
		function getShelvesForShelfUnit(value){
			$("#shelfInput").prop("disabled", false);
			$("#shelfList").empty();
			$scope.shelves = $scope.location["shelves"][$("#buildingInput").val()][$("#roomInput").val()][value];
			for(var i = 0; i < $scope.shelves.length; ++i){
				$("#shelfList").append("<option>" + $scope.shelves[i] + "</option>");
			}
		}

		// this function populated the input and options for a datalist
		// element dependent on the sessionStorage at the moment
		function getPreviousSelectionsAndOptions(){
			var temp = sessionStorage.getItem('Location')
			var savedLocation = $.parseJSON(temp);

			if(!savedLocation) {
				$("#roomInput").prop("disabled", true);
				$("#shelfUnitInput").prop("disabled", true);
				$("#shelfInput").prop("disabled", true);
			}else{
				//buildings
				if(savedLocation.building != undefined && savedLocation.building != ""){
					$("#buildingInput").val(savedLocation.building);
					getRoomsForBuilding(savedLocation.building);
				}else{
					$("#roomInput").prop("disabled", true);
				}
				// rooms
				if(savedLocation.room != undefined && savedLocation.room != ""){
					$("#roomInput").val(savedLocation.room);
					getShelfUnitsForRoom(savedLocation.room);
				}else{
					$("#shelfUnitInput").prop("disabled", true);
				}
				// shelfunits
				if(savedLocation.shelfUnit != undefined && savedLocation.shelfUnit != ""){
					$("#shelfUnitInput").val(savedLocation.shelfUnit);
					getShelvesForShelfUnit(savedLocation.shelfUnit);
					$("#shelfInput").val(savedLocation.shelf);
				}else{
					$("#shelfInput").prop("disabled", true);
				}
				//shelves
				$("#shelfInput").val(savedLocation.shelf);
				//department
				if(savedLocation.department != undefined && savedLocation.department != ""){
					$("#departmentInput").val(savedLocation.department);
				}
			}
		}

		function getAbbreviatedName(value){
			var counter = 0;
			var abbr = "";
			var strArr = value.toString().split(" ");
			if(strArr.length < 2){
				while(counter < 3){
					abbr += strArr[0][counter];
					counter++;
				}
				return abbr.toUpperCase();
			}
			for(var i = 0; i < strArr.length; ++i){
				abbr += strArr[i][0];
			}
			return abbr.toUpperCase();
		}

		$scope.addItem = function(info) {
			var temp = sessionStorage.getItem('currentUser')
			var user = $.parseJSON(temp);

			$http.post("../../php/Item/AddNewItem.php",
				{
					"itemName" : info.itemName,
					"itemCategory" : info.itemCategory,
					"building" : info.building,
					"buildingAbbreviation" : getAbbreviatedName(info.building),
					"room" : info.room,
					"shelfunit" : info.shelfUnit,
					"shelf" : info.shelf,
					"department" : info.department,
					"departmentAbbreviation" : getAbbreviatedName(info.department),
					"description" : info.description,
					"note" : info.note,
					"searchTags" : info.searchTags,
					"usePeriod" : info.usePeriod,
					'800number' : user["800_number"]
				}
			).success(function(data) {
				var loc = {
						building : info.building,
						room : info.room,
						shelfUnit : info.shelfUnit,
						shelf : info.shelf,
						department : info.department,
					};
				// set the Location in session storage
				sessionStorage.setItem('Location', JSON.stringify(loc));

				// store the last item in session to use in the success message
				sessionStorage.lastItemAdded = info.itemName;

				$route.reload(); // reload the route
			}).error(function(data) { console.log(data)	});
		}

		$scope.showSelectStartingPointPrintModal = function(pType){
			ModalService.showModal({
				templateUrl: "../../partials/admin/inventory/modals/selectStartingPointPrintModal.html",
				controller: "SelectStartingPointPrintModalController",
				inputs:{ printType: pType }
			}).then(function(modal){
				// show the modal
				modal.element.modal();

				// bind the click event of the label div(s) on the shownevent of this modal
				modal.element.on('shown.bs.modal', function () {
				   	$(".label").on("click", function(e){
						resetAllLabels();
						var num = e.target.id;
						var toColor = parseInt(num) + parseInt($scope.numItems);
						for(var i = num; i < toColor; ++i){
							$("#" + i).css("background-color", "#FED718");
						}
						$("#offset").val(num);
					}); // end .label click()
				}); // end #sheetLayoutModal shown()

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
					//empty
				});
			});

			// utility function to reset the label color in the modal
			function resetAllLabels(){
				$(".label").each(function(){
					$(this).css("background-color", "white");
				});
			}// end resetAllLabels()
		}// end $scope showSelectStartingPointPrintModal

		// initializing function for the page and controller
		$scope.initController();
	}]);

adminInventoryController.controller('ViewAllActiveItemsController', ['$scope', '$rootScope', '$http', 'ModalService',
	function ViewAllActiveItemsController($scope, $rootScope, $http, ModalService){

		$scope.activeItems;
		$scope.disposedItems;
		$scope.numItems;

		// options for the angular datatable
		$scope.dtOptions = { paging: true, searching: true,
			oLanguage : {"sEmptyTable" : "There are currently no items in the inventory!  Click <a href=\"https://hive.isg.siue.edu/admin/addItem\">here</a> to add items." } };

		// watch for broadcast of itemSentToQueue from the ChooseOptionModalController
		// on the rootScope to update the binding of the numItems scope variable
		$scope.$on('itemSentToQueue', function(event){
			$scope.$apply(function(){
				getPrintQueueCount();
			});
		});

		$scope.initController = function() {
			// get all items for view
			$http.get("../../php/Item/GetDataForInventoryView.php")
			.then(function(response){
				$scope.activeItems = response.data['activeItems'];
				$scope.disposedItems = response.data['disposedItems'];

				if($scope.activeItems != undefined){
					for (var i = $scope.activeItems.length - 1; i >= 0; i--) {
						$scope.activeItems[i]['itemIDNumber'] = pad($scope.activeItems[i]['itemIDNumber'], 6)
						if($scope.activeItems[i]['checkedOutUserEmail'] != null) {
							$scope.activeItems[i]['checkedOutUserEmail'] = "Not Available";
						} else {
							$scope.activeItems[i]['checkedOutUserEmail'] = "Available";
						}
					}
				}
			});

			if(sessionStorage.lastItemEdited != undefined && sessionStorage.lastItemEdited != "") {
				$("#resultHTML").html("<div class=\"alert alert-success fade in alert-message\" style=\"text-align: left;\"><strong>Success!</strong>  item# "
					+ sessionStorage.lastItemEdited + " was successfully updated!</div>");
			} else {
				$("#resultHTML").html("");
			}
			sessionStorage.lastItemEdited = "";

			if(sessionStorage.lastItemRemoved != undefined && sessionStorage.lastItemRemoved != "") {
				$("#resultHTML").html("<div class=\"alert alert-success fade in alert-message\" style=\"text-align: left;\"><strong>Success!</strong>  item# "
					+ sessionStorage.lastItemRemoved + " was successfully removed!</div>");
			} else {
				$("#resultHTML").html("");
			}
			sessionStorage.lastItemRemoved = "";

			if(sessionStorage.lastItemDisposed != undefined && sessionStorage.lastItemDisposed != "") {
				$("#resultHTML").html("<div class=\"alert alert-success fade in alert-message\" style=\"text-align: left;\"><strong>Success!</strong>  item# "
					+ sessionStorage.lastItemDisposed + " was successfully disposed!</div>");
			} else {
				$("#resultHTML").html("");
			}
			sessionStorage.lastItemDisposed = "";

			getPrintQueueCount();
		}

		function getPrintQueueCount(){
			// this is a GET request for getting the count of items in the
			// print queue; the print button is set as disabled if there
			// are no items in the print queue
		    $http.get("../../php/Print/GetPrintDataCount.php",
				{ params:
					{ '800number': '800'}
				})
				.then(function(response){
					$scope.numItems = response.data;
					$("input[name='printButton']").prop("disabled", $scope.numItems == 0);
			}); // end get()
		} // end getPrintQueueCount()

		$scope.deleteDisposeItem = function(id, checkedOutUserEmail) {
			if(checkedOutUserEmail == "Not Available") {
				$scope.showAdminAlertModal("Cannot delete/dispose an item that is currently checked out", "");
			} else if (checkedOutUserEmail == "Available") {
				$scope.showDeleteModal(id);
			} else {
				console.log("what")
			}
		}

		/*$scope.editItem = function(id, checkedOutUserEmail) {
			if(checkedOutUserEmail == "Not Available") {
				$scope.showAdminAlertModal("Cannot edit an item that is currently checked out", "");
			} else if (checkedOutUserEmail == "Available") {
				$scope.showEditItemModal(id);
			}
		}*/

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

		$scope.showItemInfoModal = function(itemIDNumber){
			ModalService.showModal({
				templateUrl: "../../partials/admin/inventory/modals/itemInfoModal.html",
				controller: "ItemInfoModalController",
				inputs:{ id : itemIDNumber }
			}).then(function(modal){
				modal.element.modal();

				// actually close the modal (removes backdrop)
				closeModal(modal);

				modal.close.then(function(result){

				})
			});
		}

		$scope.showEditItemModal = function(itemIDNumber){
			ModalService.showModal({
				templateUrl: "../../partials/admin/inventory/modals/editItemInfoModal.html",
				controller: "EditItemInfoModalController",
				inputs:{ itemIDNumber: itemIDNumber }
			}).then(function(modal){
				$rootScope.$broadcast('editModalShown');

				modal.element.modal();

				modal.element.on('hidden.bs.modal', function () {
				  	// remove residual modal elements
				  	$('body').removeClass('modal-open');
					$('.modal-backdrop').remove();

					// destroy destroy destroy
					$(this).data('bs.modal', null);
					$(".modal").remove();
					$("#offset").remove();
					try {
					    $rootScope.$broadcast('editModalClosed');
					}
					catch(err) {
					    console.log(err.message);
					}
				});

				modal.close.then(function(result){

				});
			});
		}

		$scope.showDeleteModal = function(itemIDNumber){
			ModalService.showModal({
				templateUrl: "../../partials/admin/inventory/modals/deleteItemModal.html",
				controller: "DeleteItemModalController",
				inputs:{ id : itemIDNumber }
			}).then(function(modal){
				modal.element.modal();

				// do stuff

				// actually close the modal (removes backdrop)
				closeModal(modal);

				modal.close.then(function(result){

				})
			});
		}

		$scope.showChoosePrintOptionModal = function(itemIDNumber){
			ModalService.showModal({
				templateUrl: "../../partials/admin/inventory/modals/choosePrintOptionModal.html",
				controller: "ChoosePrintOptionModalController",
				inputs:{ itemIDNumber : itemIDNumber }
			}).then(function(modal){
				// show the modal
				modal.element.modal();

				modal.close.then(function(result){
					// empty
				});
			});
		} // end showChoosePrintOptionModal()

		$scope.showSelectStartingPointPrintModal = function(pType){
			ModalService.showModal({
				templateUrl: "../../partials/admin/inventory/modals/selectStartingPointPrintModal.html",
				controller: "SelectStartingPointPrintModalController",
				inputs:{ printType: pType }
			}).then(function(modal){
				// show the modal
				modal.element.modal();

				// bind the click event of the label div(s) on the shownevent of this modal
				modal.element.on('shown.bs.modal', function () {
				   	$(".label").on("click", function(e){
						resetAllLabels();
						var num = e.target.id;
						var toColor = parseInt(num) + parseInt($scope.numItems);
						for(var i = num; i < toColor; ++i){
							$("#" + i).css("background-color", "#FED718");
						}
						$("#offset").val(num);
					}); // end .label click()
				}); // end #sheetLayoutModal shown()

				// actually close the modal (removes backdrop)
				closeModal(modal);

				modal.close.then(function(result){
					//empty
				});
			});

			// utility function to reset the label color in the modal
			function resetAllLabels(){
				$(".label").each(function(){
					$(this).css("background-color", "white");
				});
			}// end resetAllLabels()
		}

		function pad(number, length) {
		    var padded = '' + number;
		    while (padded.length < length) {
		        padded = '0' + padded;
		    }
		    return padded;
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

adminInventoryController.controller('ViewAllDisposedItemsController', ['$scope', '$http',
	function ViewAllDisposedItemsController($scope, $http){

		$scope.disposedItems;

		$scope.initController = function() {
			// get all items for view
			$http.get("../../php/Item/GetDataForInventoryView.php")
			.then(function(response){
				$scope.disposedItems = response.data['disposedItems'];

				if($scope.disposedItems != undefined){
					for (var i = $scope.disposedItems.length - 1; i >= 0; i--) {
						$scope.disposedItems[i]['itemIDNumber'] = pad($scope.disposedItems[i]['itemIDNumber'], 6)
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

		$scope.initController();
	}]);

adminInventoryController.controller('ViewAllLocationsController', ['$scope', '$rootScope', '$route', '$http', 'ModalService',
	function ViewAllLocationsController($scope, $rootScope, $route, $http, ModalService) {

		$scope.showDeleteLocationModal = function(building, room, shelfUnit, shelf, numItems) {

			$scope.building = building != null ? building : "";
			$scope.room = room != null ? room : "";
			$scope.shelfUnit = shelfUnit != null ? shelfUnit : "";
			$scope.shelf = shelf != null ? shelf : "";

			if(numItems != 0) {
				ModalService.showModal({
					templateUrl: "../../partials/admin/inventory/modals/deleteLocationErrorModal.html",
					controller: "DeleteLocationErrorModalController",
					inputs:{ }
				}).then(function(modal){
					modal.element.modal();

					$rootScope.$broadcast('deleteLocationErrorModalShown');

					modal.element.on('hidden.bs.modal', function () {
					  	// remove residual modal elements
					  	$('body').removeClass('modal-open');
						$('.modal-backdrop').remove();

						// destroy destroy destroy
						$(this).data('bs.modal', null);
						$(".modal").remove();
						$("#offset").remove();
						try {
						    $rootScope.$broadcast('deleteLocationErrorModalClosed');
						}
						catch(err) {
						    console.log(err.message);
						}
					});

					modal.close.then(function(result){

					})
				});
			} else {

				ModalService.showModal({
					templateUrl: "../../partials/admin/inventory/modals/confirmDeleteLocationModal.html",
					controller: "DeleteLocationModalController",
					inputs:{
						oldBuilding : $scope.building,
						oldRoom : $scope.room,
						oldShelfUnit : $scope.shelfUnit,
						oldShelf : $scope.shelf,
						numItems : numItems
					}
				}).then(function(modal){
					modal.element.modal();

					$rootScope.$broadcast('deleteLocationModalShown');

					modal.element.on('hidden.bs.modal', function () {
					  	// remove residual modal elements
					  	$('body').removeClass('modal-open');
						$('.modal-backdrop').remove();

						// destroy destroy destroy
						$(this).data('bs.modal', null);
						$(".modal").remove();
						$("#offset").remove();
						try {
						    $rootScope.$broadcast('deleteLocationModalClosed');
						}
						catch(err) {
						    console.log(err.message);
						}
					});

					modal.close.then(function(result){

					})
				});
			}
		}

		$scope.showEditLocationModal = function(oldBuilding, oldRoom, oldShelfUnit, oldShelf, numItems){

			ModalService.showModal({
				templateUrl: "../../partials/admin/inventory/modals/editLocationModal.html",
				controller: "EditLocationModalController",
				inputs:{
					oldBuilding : oldBuilding,
					oldRoom : oldRoom,
					oldShelfUnit : oldShelfUnit,
					oldShelf : oldShelf
				}
			}).then(function(modal){
				modal.element.modal();

				$rootScope.$broadcast('editLocationModalShown');

				modal.element.on('hidden.bs.modal', function () {
				  	// remove residual modal elements
				  	$('body').removeClass('modal-open');
					$('.modal-backdrop').remove();

					// destroy destroy destroy
					$(this).data('bs.modal', null);
					$(".modal").remove();
					$("#offset").remove();
					try {
					    $rootScope.$broadcast('editLocationModalClosed');
					}
					catch(err) {
					    console.log(err.message);
					}
				});

				modal.close.then(function(result){

				})
			});
		}

		// this function is the initializer for the page controlled
		// by this specific controller.  this function is called at
		// the very end of this script.  the functions herein are
		// commented individually
		$scope.initController = function() {
			// get all items for view
			$http.get("../../php/Location/GetLocationsAs2DArray.php")
			.then(function(response){
				if(response.data == null) {
					$scope.locations = undefined;
				} else {
					$scope.locations = response.data;
				}
			});
		}

		// initializing function for the page and controller
		$scope.initController();

	}]);
