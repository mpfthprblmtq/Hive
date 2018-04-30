var adminModalController = angular.module('adminModalController', ['angularModalService']);

adminModalController.controller('BugModalController', ['$scope', '$http',
	function BugModalController($scope, $http) {
		$scope.processBugForm = function(name, email, subject, problem) {
			$scope.name = name;
			$scope.email = email;
			$scope.subject = subject;
			$scope.problem = problem;

			$http.post("../php/SendBugReport.php",
				{
					"name" : $scope.name,
					"email" : $scope.email,
					"subject" : $scope.subject,
					"problem" : $scope.problem
				}
			).success(function(data) {
				// all is well
				$("#result").html("<div class=\"alert alert-success fade in alert-message\" style=\"text-align: left;\"><center><strong>Success!</strong> Email was sent!</center></div>").animate(400);
				$("input[type=submit]").attr("disabled", "disabled");
			}).error(function(data) {
				console.log(data);
			});
		}
	}]);

adminModalController.controller('SuggestionModalController', ['$scope', '$http',
	function SuggestionModalController($scope, $http) {
		$scope.processSuggestionForm = function(name, email, subject, suggestion) {
			$scope.name = name;
			$scope.email = email;
			$scope.subject = subject;
			$scope.suggestion = suggestion;

			$http.post("../php/SendSuggestionReport.php",
				{
					"name" : $scope.name,
					"email" : $scope.email,
					"subject" : $scope.subject,
					"suggestion" : $scope.suggestion
				}
			).success(function(data) {
				// all is well
				$("#result").html("<div class=\"alert alert-success fade in alert-message\" style=\"text-align: left;\"><center><strong>Success!</strong> Email was sent!</center></div>");
				$("input[type=submit]").attr("disabled", "disabled");
			}).error(function(data) {
				console.log(data);
			});
		}
	}]);

adminModalController.controller('DeleteLocationModalController', ['$scope', '$http', '$route', 'ModalService', 'oldBuilding', 'oldRoom', 'oldShelfUnit', 'oldShelf', 'numItems',
	function DeleteLocationModalController($scope, $http, $route, ModalService, oldBuilding, oldRoom, oldShelfUnit, oldShelf, numItems) {

		$scope.deleteLocation = function() {
			//call php function and pass in all necessary params
			$http.post("../php/Location/DeleteLocation.php",
				{
					"building" : $scope.building,
					"room" : $scope.room,
					"shelfUnit" : $scope.shelfUnit,
					"shelf" : $scope.shelf
				}
			).success(function(data) {

				setTimeout(function() {
					$('#resultHTML').fadeOut(300, function() {
			        	$(this).html("<div class=\"alert alert-success fade in alert-dismissable\" style=\"text-align: left;\"><strong>Success!</strong> "
							+ "Location was successfully deleted!</div>").fadeIn(500);
			    	});
				}, 100);

				//sessionStorage.removeItem('Location')
				var loc = {
						building : "",
						room : "",
						shelfUnit : "",
						shelf : "",
						department : "",
					};
				// set the Location in session storage
				sessionStorage.setItem('Location', JSON.stringify(loc));

				$route.reload();

			}).error(function(data) {

				// unknown error
				setTimeout(function() {
					$('#resultHTML').fadeOut(300, function() {
						$("#resultHTML").html("<div class=\"alert alert-danger fade in alert-dismissable\" style=\"text-align: left;\"><strong>Error</strong> "
							+ "deleting the location.</div>");
					});
				}, 100);
			});
		}

		$scope.$on('deleteLocationModalShown', function(){
			$scope.initController();
		});

		// this function is the initializer for the page controlled
		// by this specific controller.  this function is called at
		// the very end of this script.  the functions herein are
		// commented individually
		$scope.initController = function() {
			$scope.building = oldBuilding;
			$scope.room = oldRoom;
			$scope.shelfUnit = oldShelfUnit;
			$scope.shelf = oldShelf;
			$scope.numItems = numItems;
		}

		// initializing function for the page and controller
		$scope.initController();

	}]);

adminModalController.controller('DeleteLocationErrorModalController', ['$scope', '$http', '$route', 'ModalService',
	function DeleteLocationErrorModalController($scope, $http, $route, ModalService) {
		// why is this empty
	}]);

adminModalController.controller('EditLocationModalController', ['$scope', '$http', '$route', 'ModalService', 'oldBuilding', 'oldRoom', 'oldShelfUnit', 'oldShelf',
	function EditLocationModalController($scope, $http, $route, ModalService, oldBuilding, oldRoom, oldShelfUnit, oldShelf) {

		$scope.updateLocation = function(newBuilding, newRoom, newShelfUnit, newShelf) {
			$scope.newBuilding = newBuilding;
			$scope.newRoom = newRoom;
			$scope.newShelfUnit = newShelfUnit;
			$scope.newShelf = newShelf;

			//call php function and pass in all necessary params
			$http.post("../php/Location/ChangeLocationData.php",
				{
					"oldBuilding" : $scope.oldBuilding,
					"oldRoom" : $scope.oldRoom,
					"oldShelfUnit" : $scope.oldShelfUnit,
					"oldShelf" : $scope.oldShelf,
					"newBuilding" : $scope.newBuilding,
					"newRoom" : $scope.newRoom,
					"newShelfUnit" : $scope.newShelfUnit,
					"newShelf" : $scope.newShelf
				}
			).success(function(data) {
				$("#editLocationModal").modal("hide");
				$("#resultHTML").html("<div class=\"alert alert-success fade in alert-dismissable\" style=\"text-align: left;\"><strong>Success!</strong>  item# "
					+ "Location was successfully updated!</div>");

				$route.reload();


				var temp = sessionStorage.getItem('Location')
				if(temp) {
					var savedLocation = $.parseJSON(temp);

					console.log(savedLocation.department)

					var loc = {
						building : $scope.newBuilding,
						room : $scope.newRoom,
						shelfUnit : $scope.newShelfUnit,
						shelf : $scope.newShelf,
						department : savedLocation.department,
					};
					// set the Location in session storage
					sessionStorage.setItem('Location', JSON.stringify(loc));
				}

				var temp = sessionStorage.getItem('currentUser')
				var user = $.parseJSON(temp);

				$http.post("../../php/Print/AddItemsInShelfToPrintQueue.php",
					{
						"building" : $scope.newBuilding,
						"room" : $scope.newRoom,
						"shelfUnit" : $scope.newShelfUnit,
						"shelf" : $scope.newShelf,
						"user800Number" : user["800_number"]
					}
				).success(function(data) {

				}).error(function(data) { console.log(data)	});



			}).error(function(data) { console.log(data)	});
		}

		$scope.$on('editLocationModalShown', function(){
			$scope.initController();
		});

		function fillInputs() {
			$("#oldBuildingInput").val($scope.oldBuilding);
            $("#oldRoomInput").val($scope.oldRoom);
            $("#oldShelfUnitInput").val($scope.oldShelfUnit);
            $("#oldShelfInput").val($scope.oldShelf);
		}

		// this function is the initializer for the page controlled
		// by this specific controller.  this function is called at
		// the very end of this script.  the functions herein are
		// commented individually
		$scope.initController = function() {

			$scope.oldBuilding = oldBuilding;
			$scope.oldRoom = oldRoom;
			$scope.oldShelfUnit = oldShelfUnit;
			$scope.oldShelf = oldShelf;

			fillInputs();
			$('input').each(function(){
                $(this).trigger('input');
            });
		}

		// initializing function for the page and controller
		$scope.initController();

	}]);

adminModalController.controller('ItemInfoModalController', ['$scope', '$http', '$rootScope', 'ModalService', 'id',
	function ItemInfoModalController($scope, $http, $rootScope, ModalService, id){

		$scope.itemIDNumber = id;

		$http.get("../php/Item/GetFullActiveItemData.php", {
			params: { id : $scope.itemIDNumber }
		}).then(function(response){
			//console.log(response);
			// store result of query into scope after JSON parsing it
			$scope.itemInfo = JSON.parse(JSON.stringify(response.data));

			// make the id a string so it prints on the modal
			$scope.itemInfo.itemIDNumber = pad(id, 6);

			// gets a nicely formatted location
			$scope.itemInfo.formattedLoc = formatLocationForModalView(
				$scope.itemInfo["buildingIn"],
				$scope.itemInfo["roomIn"],
				$scope.itemInfo["shelfUnitIn"],
				$scope.itemInfo["shelfIn"]
			);

			// parsing for item notes, extracts date added and actual note text
			$scope.itemInfo.dateAdded = $scope.itemInfo["itemNotes"][0]["dateAdded"];
			$scope.itemInfo.text = $scope.itemInfo["itemNotes"][0]["text"];

			$scope.itemInfo.checkedOutUserEmail = $scope.itemInfo["checkedOutUserEmail"];

			//if($scope.itemInfo.checkedOutUserEmail != null) {
				$http.get("../php/User/GetFullActiveUserData.php", {
					params:	{ email : $scope.itemInfo.checkedOutUserEmail }
				}).then(function(response) {
					$scope.userInfo = JSON.parse(JSON.stringify(response.data));
					$scope.itemInfo.checkedOutUserEmail = $scope.userInfo["name"] + " (" + $scope.userInfo["email"] + ")";
				});
			//}

		});

		$scope.changeToEdit = function(id) {
			$('#itemInfoModal').fadeOut(500, function() {
				$scope.showEditItemModal($scope.itemIDNumber);
			});
		}

		$scope.showEditItemModal = function(itemIDNumber){
			ModalService.showModal({
				templateUrl: "../partials/admin/inventory/modals/editItemInfoModal.html",
				controller: "EditItemInfoModalController",
				inputs:{ itemIDNumber: itemIDNumber }
			}).then(function(modal){
				modal.element.modal();

				$rootScope.$broadcast('editModalShown');

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
					    console.log(err.message + " don't worry be happy");
					}
				});

				modal.close.then(function(result){

				})
			});
		}

		function formatLocationForModalView(building, room, shelfUnit, shelf) {

			var counter = 0;
			var abbr = "";
			var strArr = building.toString().split(" ");
			if(strArr.length < 2){
				while(counter < 2){
					abbr += strArr[0][counter];
					counter++;
				}
			} else {
				for(var i = 0; i < strArr.length; ++i){
					abbr += strArr[i][0];
				}
			}

			abbr += " ";
			abbr += room.toString();
			abbr += ", ";
			abbr += shelfUnit.toString();
			abbr += "-";
			abbr += shelf.toString();

			return abbr.toString();
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
	}]); // end ItemInfoController

adminModalController.controller('EditItemInfoModalController', ['$scope', '$rootScope', '$http', '$route', 'itemIDNumber', 'close',
	function EditItemInfoModalController($scope, $rootScope, $http, $route, itemIDNumber, close){

		$scope.itemInfo;
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
			'buildingList',
			'roomList',
			'shelfUnitList',
			'shelfList',
			'departmentList'
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

			// set the item ID number that is being looked at
			$scope.itemIDNumber = parseOutId(itemIDNumber);

			// get all the location data for use in the edit modal
			getLocationAndItemData();

			// get all teh categories for use in the edit modal
			getCategories();

			// get all the departments for use in the edit modal
			getDepartments();

			// initialize the event listeners for the datalists
			initDataListListeners();
		}

		function getLocationAndItemData(){
			// get all locations
			$http.get("../php/Location/GetAllLocationData.php")
			.then(function(response){
				$scope.location = JSON.parse(JSON.stringify(response.data));
				$scope.buildings = $scope.location["buildings"];

				// get existing item info
				$http.get("../php/Item/GetFullActiveItemData.php", {
					params: { id : $scope.itemIDNumber }
				}).then(function(response){

					$scope.itemInfo = JSON.parse(JSON.stringify(response.data));

					//  go ahead and set the previous selections if any
					fillInputs();

					$('input').each(function(){
						$(this).trigger('input');
					});

					$('textarea').each(function(){
						$(this).trigger('input');
					});
				});
			});
		}

		function getCategories(){
			// get all categories
			$http.get("../php/Item/GetItemCategories.php")
			.then(function(response){
				$scope.categories = response.data;
			});
		}

		function getDepartments(){
			// get all departments (may change to only show admin assigned depts later on)
			$http.get("../php/Location/GetAllDepartments.php")
			.then(function(response){
				$scope.departments = response.data;
			});
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
		    if($('#' + ListTagArr[e.target.index]).find('option').filter(function(){
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
				$('#' + ListTagArr[index]).empty();
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
		function fillInputs(){
			//itemName
			$("#itemNameInput").val($scope.itemInfo["itemName"]);

			//itemCategory
			$("#itemCategoryInput").val($scope.itemInfo["itemCategoryName"]);

			//buildings
			$("#buildingInput").val($scope.itemInfo["buildingIn"]);
			getRoomsForBuilding($scope.itemInfo["buildingIn"]);

			// rooms
			$("#roomInput").val($scope.itemInfo["roomIn"]);
			getShelfUnitsForRoom($scope.itemInfo["roomIn"]);

			// shelfunits
			$("#shelfUnitInput").val($scope.itemInfo["shelfUnitIn"]);
			getShelvesForShelfUnit($scope.itemInfo["shelfUnitIn"]);

			//shelves
			$("#shelfInput").val($scope.itemInfo["shelfIn"]);

			//department
			$("#departmentInput").val($scope.itemInfo["department"]);

			//description
			$("#descriptionInput").val($scope.itemInfo["description"]);

			//notes
			$("#noteInput").val($scope.itemInfo["notes"]);

			//searchTags
			$("#searchTagsInput").val($scope.itemInfo["searchTags"]);

			//usePeriod
			var usePeriod = $scope.itemInfo["usePeriod"];
			$("#usePeriodInput").val(parseInt(usePeriod));
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

		function parseOutId(id){
			var strArray = id.split("");
			var counter = 0;
			var newId = "";
			while(counter < strArray.length){
				if(strArray[counter] != "0"){
					newId += strArray[counter];
					counter++;
					while(counter < strArray.length){
						newId += strArray[counter];
						counter++;
					}
				}
				counter++;
			}
			return parseInt(newId);
		}

		$scope.submitChanges = function(info){
			//call php function and pass in all necessary params
			var searchTags = info.searchTags.replace(/,/g, " ");
			$http.post("../php/Item/UpdateItem.php",
				{
					"idNumber" : $scope.itemIDNumber,
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
					"searchTags" : searchTags,
					"usePeriod" : info.usePeriod,
					'800number' : '800'
				}
			).success(function(data) {
				sessionStorage.lastItemEdited = $scope.itemIDNumber;
				$("#editItemInfoModal").modal("hide");
				$route.reload();
			}).error(function(data) { console.log(data)	});
		}

		$scope.$on('editModalShown', function(){
			$scope.initController();
		});

		$scope.$on('editModalClosed', function(){
			$scope.$destroy();
		});

	}]).directive('stringToNumber', function() {
	  		return {
	    		require: 'ngModel',
	    		link: function(scope, element, attrs, ngModel) {
	      			ngModel.$parsers.push(function(value) {
	        		return '' + value;
	      		});
		      	ngModel.$formatters.push(function(value) {
		        	return parseFloat(value);
		      	});
	    	}
	  	};
	});

adminModalController.controller('DeleteItemModalController', ['$scope', '$http', '$rootScope', 'ModalService', 'id',
	function DeleteItemModalController($scope, $http, $rootScope, ModalService, id){
		$scope.itemIDNumber = id;

		$scope.changeToDisposeModal = function(id) {
			$('#deleteModal').fadeOut(500, function() {
				$scope.showDisposeModal($scope.itemIDNumber);
			});
		}

		$scope.showDisposeModal = function(itemIDNumber){

			ModalService.showModal({
				templateUrl: "../partials/admin/inventory/modals/disposeInfoModal.html",
				controller: "DisposeModalController",
				inputs:{ id : itemIDNumber }
			}).then(function(modal){
				modal.element.modal();

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

		$scope.changeToConfirmDeleteModal = function(id) {
			$('#deleteModal').fadeOut(500, function() {
				$scope.showConfirmDeleteModal($scope.itemIDNumber);
			});
		}

		$scope.showConfirmDeleteModal = function(itemIDNumber){
			//console.log($scope.itemIDNumber + " in showConfirmDeleteModal()");
			ModalService.showModal({
				templateUrl: "../partials/admin/inventory/modals/confirmItemDeleteModal.html",
				controller: "ConfirmItemDeleteModalController",
				inputs:{ id : itemIDNumber }
			}).then(function(modal){
				modal.element.modal();

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
	}]);

adminModalController.controller('ConfirmItemDeleteModalController', ['$scope', 'id', '$http', '$route',
	function ConfirmItemDeleteModalController($scope, id, $http, $route){

		$scope.itemIDNumber = parseOutId(id);

		$scope.deleteItem = function(id) {
			$http.post("../php/Item/DeleteItemFromDatabase.php",
				{
					"itemID" : $scope.itemIDNumber
				}
			).success(function(response) {
				sessionStorage.lastItemRemoved = $scope.itemIDNumber;
				$('#confirmDeleteModal').modal('hide');
				$route.reload();
			}).error(function(response){
				console.log(data);
			});
		}

		function parseOutId(id){
			var strArray = id.split("");
			var counter = 0;
			var newId = "";
			while(counter < strArray.length){
				if(strArray[counter] != "0"){
					newId += strArray[counter];
					counter++;
					while(counter < strArray.length){
						newId += strArray[counter];
						counter++;
					}
				}
				counter++;
			}
			return parseInt(newId);
		}
	}]);

adminModalController.controller('DisposeModalController', ['$scope', 'id', '$http', '$route',
	function DisposeModalController($scope, id, $http, $route){

		$scope.itemIDNumber = parseOutId(id);

		$scope.dispose = function(id, reason, method) {
			$http.post("../php/Item/DisposeOfItem.php",
				{
					'itemID' : $scope.itemIDNumber,
					'reason' : reason,
					'disposalMethod' : method
				}
			).success(function(data) {
				sessionStorage.lastItemDisposed = $scope.itemIDNumber;
				$('#disposeInfoModal').modal('hide');
				$route.reload();
			}).error(function(response){
				console.log(data);
			});
		}

		function parseOutId(id){
			var strArray = id.split("");
			var counter = 0;
			var newId = "";
			while(counter < strArray.length){
				if(strArray[counter] != "0"){
					newId += strArray[counter];
					counter++;
					while(counter < strArray.length){
						newId += strArray[counter];
						counter++;
					}
				}
				counter++;
			}
			return parseInt(newId);
		}
	}]);

adminModalController.controller('ChoosePrintOptionModalController', ['$scope', '$rootScope', 'ModalService', 'itemIDNumber',
	function ChoosePrintOptionModalController($scope, $rootScope, ModalService, itemIDNumber){

		$scope.itemIDNumber = itemIDNumber;

		$scope.sendItemToPrintQueue = function(){
			// empty the print queue because we have printed our data
			$.post("../php/Print/PostAddItemToPrintQueue.php",
		 	{
		 		'800number' : '800',
		 		'itemIDNumber' :  $scope.itemIDNumber
		 	}).done(function(data){
		 		// broadcast the itemSentToQueue to the ViewAllItemsController
		 		// to update that controller's numItems scope variable
		 		$rootScope.$broadcast('itemSentToQueue');
	    		console.log(data);
		    }); // end post
		}

		$scope.showSelectStartingPointPrintModal = function(pType){
			ModalService.showModal({
				templateUrl: "../partials/admin/inventory/modals/selectStartingPointPrintModal.html",
				controller: "SelectStartingPointPrintModalController",
				inputs:{ printType: pType }
			}).then(function(modal){
				// show the modal
				modal.element.modal();

				// broadcast on the rootScope so the SelectStartingPointPrintModalController
				// can set it's scope itemIDNumber
				$rootScope.$broadcast('sendItemID', { itemId: $scope.itemIDNumber });

				// bind the click event of the label div(s) on the shown event of this modal
				modal.element.on('shown.bs.modal', function () {
				   	$(".label").on("click", function(e){
						resetAllLabels();
						var num = e.target.id;
						$("#" + num).css("background-color", "#FED718");
						$("#offset").val(num);
					}); // end .label click()
				}); // end modal shown()

				modal.element.on('hidden.bs.modal', function () {
				  	// remove residual modal elements
				  	$('body').removeClass('modal-open');
					$('.modal-backdrop').remove();

					// destroy destroy destroy
					$(this).data('bs.modal', null);
					$(".modal").remove();
					$("#offset").remove();
				}); // end modal hidden()

				modal.close.then(function(result){
					// empty
				});
			});
		} // end showSelectStartingPointPrintModal()

		// utility function to reset the label color in the modal
		function resetAllLabels(){
			$(".label").each(function(){
				$(this).css("background-color", "white");
			});
		}// end resetAllLabels()
	}]);

adminModalController.controller('SelectStartingPointPrintModalController', ['$scope', '$http', '$route', 'close', 'printType', 'ModalService',
	function SelectStartingPointPrintModalController($scope, $http, $route, close, printType, ModalService, itemIDNumber){

		$scope.labels = [];
		$scope.sampleLabelNum = 30;
		$scope.printType = printType;

		// event listener for the 'sendItemID'
		$scope.$on('sendItemID', function(event, data){
			$scope.itemIDNumber = data.itemId;
		});

		// this function is used within the modal for selecting
		// a start option for printing labels; it provides an
		// ability to iterate and create 'label' div elements
		$scope.getLabelNum = function(num){
			return new Array(num);
		};

		// this $scope function is used in the partial view addItem.html
		// to retrieve all the print queue data in JSON form; this data
		// is set to the $scope 'labels' variable and passed in elsewhere
		// in this controller
		$scope.submitAndPrint = function(){
			// if print type is for ALL in the printqueue table
			if($scope.printType == 'ALL'){
				$http.get("../php/Print/GetPrintData.php",
				{ params:
					{
						'800number': '800'
					}
				})
				.then(function(response){
					$scope.labels = JSON.stringify(response.data);
					createAveryPrintTemplate(); // after the GET request, go ahead and SUBMIT
				}); // end get()
			// else if print type is for only a SINGLE entry outside of the printqueue table
			}else if($scope.printType == 'SINGLE'){
				$http.get("../php/Print/GetSinglePrintData.php",
				{ params:
					{
						'800number': '800',
						'itemIDNumber' : $scope.itemIDNumber
					}
				})
				.then(function(response){
					$scope.labels = JSON.stringify(response.data);
					createAveryPrintTemplate(); // after the GET request, go ahead and SUBMIT
				}); // end get()
			} // end else-if
		}; // end of submitAndPrint()

	   	// function to make the submit of the modal;
	   	// this will make the POST request to the 'averyBarcodeTemplate.php'
	   	// file in the views folder; a new window populates and the new
	   	// barcodes are able to be printed from this window; the label data
	   	// is sent in with the PHP POST request as the $scope 'labels'
		function createAveryPrintTemplate(){
			// make a post request to cerate the barcode template
			$.post("../views/averyBarcodeTemplate.php",
			{
			 	oSet: $("#offset").val(),
			 	labels: $scope.labels
			}).done(function(data){
			 	// remove residual modal elements and close
			  	$('body').removeClass('modal-open');
				$('.modal-backdrop').remove();
				close(null, 500);

			 	// try and create a new blank target window
			 	try{
			 		var newWindow = window.open("","_blank");
					with(newWindow.document)
				    {
				      open();
				      write(data);
				      close();
				    }
				    if($scope.printType == 'ALL'){
				 		// empty the print queue because we have printed our data
						$.post("../php/Print/PostEmptyPrintQueue.php",
					 	{ '800number' : '800' }).done(function(data){
				    		$route.reload(); // reload the route
					    }); // end post
				 	}// end if
			 	}
			 	catch( err ){
			 		showPopUpWarningAlertModal();
			 		return;
			 	}
		    }); // end post()
		} // end createAveryPrintTemplate()

		function showPopUpWarningAlertModal(){
			ModalService.showModal({
				templateUrl: "../partials/admin/inventory/modals/popUpWarningAlertModal.html",
				controller: "PopUpWarningAlertModalController"
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
				}); // end modal hidden()

				modal.close.then(function(result){
					// empty
				});
			});
		} // end showPopUpWarningAlertModal()
	}]);

adminModalController.controller('EditUserModalController', ['$scope', '$rootScope', '$http', '$route', 'email', 'close',
	function EditUserModalController($scope, $rootScope, $http, $route, email, close){

		// edit user info here
		$scope.email = email;

		$scope.initController = function(){
			getUserData();
		}

		function getUserData(){
			// get existing user info
			$http.get("../php/User/GetFullActiveUserData.php", {
				params: { email : $scope.email }
			}).then(function(response){

				$scope.userInfo = JSON.parse(JSON.stringify(response.data));

				fillInputs();

				$('input').each(function(){
					$(this).trigger('input');
				});

				$('#phoneNumberInput').keyup(function() {
				    this.value = this.value
				        .match(/\d*/g).join('')
				        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/).slice(1).join('-')
				        .replace(/-*$/g, '');
				});
			});
		}

		function fillInputs(){
			$("#uNumberInput").val($scope.userInfo["800number"]);
			$("#cNumberInput").val($scope.userInfo["barcodeNumber"]);

		   $('select[id="userLevelInput"]').find(
			'option[value=' + parseInt($scope.userInfo["selfServe"]) +']'
			).attr("selected",true);

			$("#userNameInput").val($scope.userInfo["name"]);
			$("#phoneNumberInput").val($scope.userInfo["phoneNumber"]);
			$("#emailInput").val($scope.userInfo["email"]);
		}

		$scope.submitChanges = function(info){

			//if(!validateInput())
				//return;
/*
			$http.post("../../php/User/DeleteUser.php",
				{
					"email" : $scope.email
				}
			).success(function(){
				$http.post("../../php/User/AddNewUser.php",
					{
						"name" : info.name,
						"idNumber" : info.uNumber,
						"cardNumber" : info.cNumber,
						"phoneNumber" : info.phoneNumber,
						"email" : info.email,
						"selfServe" : parseInt($('select[id="userLevelInput"]').val())
						// need a place to put in the amount of items checked out (other branch)
					}
				).success(function(data) {
					sessionStorage.lastUserEdited = info.email;
					$("#editUserInfoModal").modal("hide");
					$route.reload(); // reload the route
				}).error(function(data) { console.log(data)	});

			}).error(function(data) { console.log(data)	});
			*/

			$http.post("../../php/User/UpdateUser.php",
			{
				"oldEmail" : $scope.email,
				"newEmail" : info.email,
				"name" : info.name,
				"800Number" : info.uNumber,
				"cardNumber" : info.cNumber,
				"selfServe" : parseInt($('select[id="userLevelInput"]').val()),
				"phoneNumber" : info.phoneNumber
			}
		).success(function(data) {
			console.log("success in editing the user")
			console.log(data)
		}).error(function(data) {
			console.log(data)
		})

		}

		$scope.$on('editUserModalShown', function(){
			$scope.initController();
		});

		$scope.$on('editUserModalClosed', function(){
			$scope.$destroy();
		});

		function validateInput(){
			var result = true;
			if($("#uNumberInput").val().length != 9){
				$("#uNumberInput").tooltip("show");
				result = false;
				return result;
			}else{
				$("#uNumberInput").tooltip("hide");
				result = true;
			}
			if($("#cNumberInput").val().length != 16){
				$("#cNumberInput").tooltip("show");
				result = false;
				return result;
			}else{
				$("#cNumberInput").tooltip("hide");
				result = true;
			}
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

	}]);

adminModalController.controller('AddUserSwipeModalController', ['$scope', 'ModalService',
	function AddUserSwipeModalController($scope, ModalService) {

		$(document).ready(function() {
			setTimeout(function() {
				$("#cardNumberInput").focus();
			}, 500)
		});

		$scope.inputCardNumber = function(str) {
			console.log(document.activeElement)
			var newStr = str.substring(1,17);

			$("#cardNumber").val(newStr)

			$('#addUserSwipeModal').modal('hide');
		}
	}
]);

adminModalController.controller('DeleteUserModalController', ['$scope', '$rootScope', '$http', '$route', 'email',
	function DeleteUserModalController($scope, $rootScope, $http, $route, email){

		$scope.userEmail = email;

		$scope.deleteUser = function() {
			$http.post("../php/User/DeleteUser.php",
				{
					"email" : $scope.userEmail
				}
			).success(function(response) {
				sessionStorage.lastUserRemoved = $scope.userId;
				$('#deleteUserModal').modal('hide');
				$route.reload();
			}).error(function(response){
				console.log(data);
			});
		}

	}]);

adminModalController.controller('EmailUserModalController', ['$scope', '$http', 'ModalService', 'name', 'email',
	function EmailUserModalController($scope, $http, ModalService, name, email) {
		//$scope.userEmail = email;

		$(document).ready(function() {
			$("#name").val(name);
			$("#email").val(email);
			$("#message").val("\n\n\n\n\n\nRegards,\n\nHive Resource Manager");

			$('input').each(function(){
	    	$(this).trigger('input');
			});
		});

		$scope.emailUser = function(name, email, subject, message) {
			$scope.name = name;
			$scope.email = email;
			$scope.subject = subject;
			$scope.message = message;

			$http.post("../php/SendEmail.php", {
									"name" : $scope.name,
									"email" : $scope.email,
									"subject" : $scope.subject,
									"message" : $scope.message

			 					}
							).success(function(response) {
					$("#result").html("<div class=\"alert alert-success fade in alert-message\" style=\"text-align: left;\"><center><strong>Success!</strong> Email was sent!</center></div>").animate(400);
					$("input[type=submit]").attr("disabled", "disabled");

			}).error(function(response){
				//console.log(response);
			});
		}
	}]);

adminModalController.controller('PopUpWarningAlertModalController', ['$scope',
	function PopUpWarningAlertModalController($scope){
		//empty; only needed for the Modal Service library controller constructor element
	}]);

adminModalController.controller('AdminAlertModalController', ['$scope', '$http', '$route', 'ModalService', 'message', 'route',
	function AdminAlertModalController($scope, $http, $route, ModalService, message, route) {

		$scope.message = message;

		// sets the focus to the ok button
		$(document).ready(function() {
			setTimeout(function() {
				$("#alertOkButton").focus();
			}, 500)
		})

		$scope.routeAsNeeded = function(){
			if(route != ""){
				$(location).attr("href", route);
			}
		}
	}]);
