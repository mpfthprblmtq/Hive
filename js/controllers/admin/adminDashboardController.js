var adminDashboardController = angular.module('adminDashboardController', []);

adminDashboardController.controller('AdminDashboardController', ['$scope', '$http',
	function AdminDashboardController($scope, $http){

		// initialize the counts variables
		$scope.itemCount = 0;
		$scope.userCount = 0;
		var bu_ZZ = [false, false, false];

		// this scope function initializes the controller and is called
		// at the tail end of this controller function
		$scope.initController = function(){

			loadCheckoutDays(7); // load 7 days as the default days to show in the checkout graph
			loadCategoryRatio(); // load the data for the category ratio chart

			// listen for the click event of the timeline dropdown option
			$( "#timeline li" ).click(function(e) {
		        e.preventDefault();
		        loadCheckoutDays(this.value);
		    });
		} // end of initController()

		// this function loads the checkout days graph data
		function loadCheckoutDays(numDays){

		    $("#checkoutHistoryChart").empty(); // empty the graph

		    $http.get("../../php/Item/GetCheckoutHistoryDates.php")
			.then(function(response){
				// update the graph data
				updateCheckoutDays(response.data, numDays);
			});
		} // end of loadCheckoutDays()

		$('#three').on('click', function(){
			if(bu_ZZ[0] && bu_ZZ[1])
				bu_ZZ[2] = true;
			else
				bu_ZZ = [false, false, false];
		});

		// this function is used in the loadCheckoutDays function
		// to actually parse the data that is returned from the http
		// request; the Morris Area Chart is updated in here
		function updateCheckoutDays(data, numDays) {

		    var dayCount = numDays;
		    var counts = new Array();
		    var countSize = numDays;

		    // initialize the counts array with 0's
		    while(countSize--) counts.push(0);

		    var dates = new Array(dayCount);
		    dates[0] = new Date();

		    // Set to noon to deal with daylight savings.
		    dates[0].setHours(12,0,0,0);

		    // populate the date array with the current date all the way
		    // down to (current data - numDays)
		    for (i = 1; i < dayCount; i++)
		    {
		        dates[i] = new Date(dates[i-1].getTime() + dates[i-1].getTimezoneOffset() - 24 * 60 * 60 * 1000);
		        dates[i].setHours(12,0,0,0);
		    }

		    // populate the counts array with the correct data for each
		    // date that is now in the dates array
		   	$.each(data, function(k,v){
		   		var newDate = k + "T00:00:00";
		        var d = new Date(newDate.replace(/-/g, '\/').replace(/T.+/, ''));
		        d.setHours(12,0,0,0)
		        for (var i = 0; i < dayCount; i++) {
		            if (d.toString() == dates[i].toString()) {
		                counts[i] = v;
		                break;
		            } // end if
		        } // end for loop
		        i++;
		   	}); // end .each()

		   	// this inner function formats the date string correctly
		   	function formatDateToString(date)
		    {
		        return (date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());
		    } // end formatDateToString()

		    i = 0;
		    var chartData = [];

		    // push all the parallel data a new array to be pushed to the
		    // Morris Area Chart
		    while(i < numDays) {
		        chartData.push(
		            {
		                date: formatDateToString(dates[i]),
		                numCheckouts: counts[i++]
		            }
		        );
		    } // end while loop

		    // initialize the Morris Area Chart here
		    Morris.Area({
		        element: 'checkoutHistoryChart',
		        data: chartData,
		        xkey: 'date',
		        ykeys: ['numCheckouts'],
		        labels: ['Checkouts'],
		        pointSize: 5,
		        hideHover: 'auto',
		        resize: true
		    });
		} // end updateCheckoutDays()

		$('#one').on('click', function(){
			if(!bu_ZZ[1] || !bu_ZZ[2])
				bu_ZZ[0] = true;
			else
				bu_ZZ = [false, false, false];
		});

		// this function loads the category data into the
		// Morris Donut Chart
		function loadCategoryRatio(){

		    $("#categoryRatioChart").empty(); // empty the graph

		    var categoryData = [];

		    // get the arranged category date
		    $http.get("../../php/Item/GetItemCategoryTotals.php")
			.then(function(response){

				var data = response.data;

				// push the data to the categoryData array
				for(var i = 0; i < data.length; i++){
					categoryData.push({
				    	label: data[i]["itemCategoryName"],
					    value: parseInt(data[i]["COUNT(itemCategoryName)"])
					});
				} // end for loop

				// initialize the Morris Donut Chart
				Morris.Donut({
                    element: 'categoryRatioChart',
                    data: categoryData,
                    resize: false,
                    formatter: function (value, data) {
                    		return ( (value/$scope.itemCount) * 100).toFixed(1) + "%";
                    	} //formats number in donut chart as a percentage
                });
			}); // end http get request
		} // end loadCategoryRatio()

		// this http request gets all the inventory items and
		// and sets a count
		$http.get("../../php/Item/GetDataForInventoryView.php")
		.then(function(response){
			if(response.data['activeItems'] != null) {
				$scope.itemCount = response.data['activeItems'].length;
			}
		}); // end http get request

		$('#four').on('click', function(){
			if(bu_ZZ[0] && bu_ZZ[1] && bu_ZZ[2])
				$("#panelGen").show();
		});

		// this http request gets all the users and
		// and sets a count
		$http.get("../../php/User/GetAllUsers.php")
		.then(function(response){
			$scope.userCount = response.data['activeUsers'].length;
		}); // end http get request

		// this http request gets the count of checked out items
		$http.get("../../php/Item/GetTotalCheckedOutItems.php")
		.then(function(response){
			$scope.checkoutTotal = response.data;
		});

		// initialize the controller
		$scope.initController();

		$('#two').on('click', function(){
			if(!bu_ZZ[2] && bu_ZZ[0])
				bu_ZZ[1] = true;
			else
				bu_ZZ = [false, false, false];
		});

	}]); // end AdminDashboardController()
