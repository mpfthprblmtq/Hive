var adminReportController = angular.module('adminReportController', ['datatables', 'datatables.buttons']);

adminReportController.controller('InventoryReportController', ['$scope', '$http', 'DTOptionsBuilder',
	function InventoryReportController($scope, $http, DTOptionsBuilder){

		// set options for the angular datatable with export,
		// print, and copy buttons
		$scope.dtOptions =
			DTOptionsBuilder.newOptions()
			.withOption('paging', true)
			.withOption('searching', true)
			.withOption('oLanguage', {"sEmptyTable" : "There are currently no items in the system!"})
			.withOption('dom', 'Bfrtip')
			.withButtons([
	  			{
		  			extend:    'copy',
		  			text:      '<i class="fa fa-files-o"></i> Copy',
		  			titleAttr: 'Copy'
	  			},
	  			{
		  			extend:    'print',
		  			text:      '<i class="fa fa-print" aria-hidden="true"></i> Print',
		  			titleAttr: 'Print'
	  			},
	  			{
		  			extend:    'excelHtml5',
		 				text:      '<i class="fa fa-file-text-o"></i> Excel',
		  			titleAttr: 'Excel',
		  			title: 'Hive Inventory Report'
	  			}
  			]); // end dtOptions

		// this function initializes the controller and is called
		// at the end of this controller function
		$scope.initController = function() {
			// get all items for view
			$http.get("../../php/Item/GetDataForInventoryView.php")
			.then(function(response){
				$scope.activeItems = response.data['activeItems'];
			});
		} // end initController()

		// this function gets called when an admin clicks the export
		// button for a row of data in the inventory items table
		$scope.export = function(itemId){

			// this http get function gets all the item data
			// specific for export
			$http.get("../../php/Item/GetItemDataForExport.php",
				{ params:
					{ 'itemId': parseInt(itemId) }
				})
			.then(function(response){

				// set the data to variable item
				var item = response.data;

				// using the 3rd party library, create an ExcelPlus object
				var ep = new ExcelPlus();

				// create the file that is to be created
				ep.createFile(item['itemName'])
				  	.write({ "content" : [ [ "ID", "Name" ] ] })
				  	.write({ "cell" : "A2", "content": item['itemIDNumber'] })
				  	.write({ "cell" : "B2", "content": item['itemName'] })
				  	.write({ "cell" : "A3", "content" : " " })
				  	.writeNextRow( [ "Checked Out By", "Check Out Date", "Check In Date" ] );

				// follow through here is the item has a data in the checkouthistory table
			  	if(item.checkoutHistory){
				  	for(var i = 0; i < item.checkoutHistory.length; i++){
					  	ep.writeNextRow(
					  		[
					  			item.checkoutHistory[i]['name'] == "" ? 'NONE' : item.checkoutHistory[i]['name'],
					  			item.checkoutHistory[i]['dateCheckedOut'] == "" ? 'NONE' : item.checkoutHistory[i]['dateCheckedOut'],
					  			item.checkoutHistory[i]['dateCheckedIn'] == "" ? 'NONE' : item.checkoutHistory[i]['dateCheckedIn']
				  		]);
			  		} // end for loop
			  	}else{
			  		ep.writeNextRow( [ "no checkouts yet" ] );
			  	} // end if-else

			  	// save the new file; this prompts the browser to download
				ep.saveAs( item['itemName'] + ".xlsx");
			}); // end http get request
		} // end export function

		// initialize the controller
		$scope.initController();
	}]); // end ItemReportController

adminReportController.controller('UserReportController', ['$scope', '$http', 'DTOptionsBuilder',
	function UserReportController($scope, $http, DTOptionsBuilder){

		// set options for the angular datatable with export,
		// print, and copy buttons
		$scope.dtOptions =
			DTOptionsBuilder.newOptions()
			.withOption('paging', true)
			.withOption('searching', true)
			.withOption('oLanguage', {"sEmptyTable" : "There are currently no users in the system!"})
			.withOption('dom', 'Bfrtip')
			.withButtons([
	  			{
		  			extend:    'copy',
		  			text:      '<i class="fa fa-files-o"></i> Copy',
		  			titleAttr: 'Copy'
	  			},
	  			{
		  			extend:    'print',
		  			text:      '<i class="fa fa-print" aria-hidden="true"></i> Print',
		  			titleAttr: 'Print'
	  			},
	  			{
		  			extend:    'excelHtml5',
		 			text:      '<i class="fa fa-file-text-o"></i> Excel',
		  			titleAttr: 'Excel',
		  			title: 'Hive User Report'
	  			}
  			]);// end dtOptions

		// this function initializes the controller and is called
		// at the end of this controller function
		$scope.initController = function() {
			// get all items for view
			$http.get("../../php/User/GetAllUsers.php")
			.then(function(response){
				$scope.activeUsers = response.data['activeUsers'];
			});
		} // end initController()

		// this function gets called when an admin clicks the export
		// button for a row of data in the active users table
		$scope.export = function(email){

			// get the user's data from the scope activeUsers variable
			for(var i = 0; i < $scope.activeUsers.length; i++){
				if($scope.activeUsers[i]["email"] == email){
					var user = $scope.activeUsers[i];
					break;
				} // end if-else
			} // end for loop

			// if there is no user match, return out
			if(user == undefined) return;

			// using the 3rd party library, create an ExcelPlus object
			var ep = new ExcelPlus();

			// create the file that is to be created
			ep.createFile(user['name'])
			  	.write({ "content":[ [ "Name", "Email", "Phone", "800 Number", "Type" ] ] })
			  	.write({ "cell":"A2", "content": user['name'] })
			  	.write({ "cell":"B2", "content": user['email'] })
			  	.write({ "cell":"C2", "content": user['phoneNumber'] })
			  	.write({ "cell":"D2", "content": user['800number'] == null || user['800number'] == "" ? 'NONE' : user['800number']})
			  	.write({ "cell":"E2", "content": user['selfServe'] == 1 ? "Assisted" : "Self Serve" })
			  	.write({ "cell" : "A3", "content" : " " })
			  	.writeNextRow( [ "Item ID", "Item Name", "Checkout Date", "Check in Date" ] );

			// follow through here is the user has data in the checkouthistory table
		  	if(user.checkoutHistory){
			  	for(var i = 0; i < user.checkoutHistory.length; i++){
				  	ep.writeNextRow(
				  		[
				  			user.checkoutHistory[i]['itemIDNumber'] == "" ? 'NONE' : user.checkoutHistory[i]['itemIDNumber'],
				  			user.checkoutHistory[i]['itemName'] == "" ? 'NONE' : user.checkoutHistory[i]['itemName'],
				  			user.checkoutHistory[i]['dateCheckedOut'] == "" ? 'NONE' : user.checkoutHistory[i]['dateCheckedOut'],
				  			user.checkoutHistory[i]['dateCheckedIn'] == "" ? 'NONE' : user.checkoutHistory[i]['dateCheckedIn']
			  		]);
		  		} // end for loop
		  	}else{
		  		ep.writeNextRow( [ "no checkouts yet" ]);
		  	} // end if-else

		  	// save the new file; this prompts the browser to download
			ep.saveAs( user['name'] + ".xlsx");
		} // end export function

		// initialize the controller
		$scope.initController();
	}]); // end UserReportController
