<?php
	// Ths file contains item related database queries and functions for data retrieval

	function InsertItemCategory( $databaseConnection, $itemCategory )
	{
		$query = "INSERT IGNORE INTO itemcategory( name ) values( '$itemCategory' )";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			echo "Item category add error<br>";
			echo("Error description: " . mysqli_error( $databaseConnection) );
		}
	}

	function InsertItem( $databaseConnection, $itemCategory, $itemName, $itemDescription )
	{
		$query = "INSERT IGNORE INTO item( name, itemCategory, description ) values( '$itemName', '$itemCategory', '$itemDescription' )";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			echo "Item add error<br>";
			echo("Error description: " . mysqli_error($databaseConnection));
		}
	}

	function InsertIndividualItem( $databaseConnection, $itemCategory, $itemName )
	{
		$query = "INSERT IGNORE INTO individualitem( itemCategoryName, itemName ) values( '$itemCategory', '$itemName' )";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			echo "Individual item add error<br>";

			echo("Error description: " . mysqli_error( $databaseConnection ) );
		}

		$query = "SELECT MAX( idNumber ) FROM individualitem";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			echo "Select new item number error<br>";

			echo("Error description: " . mysqli_error( $databaseConnection ) );
		}

		else
		{
			$id = array();

			$id = mysqli_fetch_array ( $queryResult );

			$idNumber = $id[0];

			return $idNumber;
		}
	}

	function InsertDepartment( $databaseConnection, $departmentName, $departmentAbbreviaton )
	{
		$query = "INSERT IGNORE INTO department( name, abbreviation ) VALUES( '$departmentName', '$departmentAbbreviaton' )";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			echo "Deparment add error<br>";

			echo( "Error description: " . mysqli_error( $databaseConnection ) );
		}
	}

	function GetDepartments( $databaseConnection )
	{
		$query = "SELECT * FROM department";

		$results = mysqli_query( $databaseConnection, $query );

		if( mysqli_num_rows( $results ) != 0 )
		{
			while( $row = mysqli_fetch_assoc( $results ) )
			{
				$resultArray[] = $row;
			}
		}

		echo $jsonData = json_encode( $resultArray );
	}

	function InsertActiveItem( $databaseConnection, $idNumber, $departmentName, $buildingName, $roomNumber, $shelfUnitNumber, $shelfNumber, $usePeriod )
	{
		$query = "INSERT IGNORE INTO activeitem( itemIDNumber, department, buildingIn, roomIn, shelfUnitIn, shelfIn, usePeriod )
				  values( '$idNumber', '$departmentName', '$buildingName', '$roomNumber', '$shelfUnitNumber', '$shelfNumber', '$usePeriod' )";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			echo "Active item add error<br>";

			echo("Error description: " . mysqli_error($databaseConnection));
		}
	}

	function GetItemDescription( $databaseConnection, $itemName, $itemCategory )
	{
		$query = "SELECT description FROM item WHERE name = &itemName AND itemCategory = $itemCategory";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			echo "Selecting item description error<br>";

			echo("Error description: " . mysqli_error($databaseConnection));
		}

		else
		{
			$queryResult = json_encode( $queryResult );

			return $queryResult;
		}
	}

	function InsertNote( $databaseConnection, $idNumber, $itemNote, $date )
	{
		echo $date;

		$query = "INSERT INTO note( text, itemNumber, dateAdded ) values ( '$itemNote', '$idNumber', '$date' )";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			echo "Inserting note error<br>";

			echo("Error description: " . mysqli_error( $databaseConnection ) );
		}
	}

	function SelectAllItems( $databaseConnection )
	{
		$query = "SELECT * FROM item";

		$results = mysqli_query( $databaseConnection, $query );

		if( mysqli_num_rows( $results ) != 0 )
		{
			while( $row = mysqli_fetch_assoc( $results ) )
			{
				$resultArray[] = $row;
			}
		}

		echo $jsonData = json_encode( $resultArray );
	}

	function InsertSearchTag( $databaseConnection, $searchTag )
	{
		$query = "INSERT IGNORE INTO searchtag( name ) values ( '$searchTag' )";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			echo "Inserting search tag error<br>";

			echo("Error description: " . mysqli_error( $databaseConnection ) );
		}
	}

	function InsertSearchableBy( $databaseConnection, $searchTag, $itemName, $itemCategory )
	{
		$query = "INSERT IGNORE INTO searchableby( itemName, itemCategory, searchTag ) values( '$itemName', '$itemCategory', '$searchTag' )";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			echo "Inserting into searchableby error<br>";

			echo("Error description: " . mysqli_error( $databaseConnection ) );
		}
	}

	function SelectDataForGeneralView( $databaseConnection )
	{
		$resultArray = array();

		$query = "SELECT abbreviation, itemIDNumber, checkedOutUserEmail, itemName, itemCategoryName FROM activeitem, individualitem, department WHERE activeitem.department = department.name AND activeitem.itemIDNumber = individualitem.idNumber";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( mysqli_num_rows( $queryResult ) != 0 )
		{
			$i = 0;

			while( $row = mysqli_fetch_assoc( $queryResult ) )
			{
				$resultArray[ 'activeItems' ][ $i ] = $row;

				$itemName = $row[ 'itemName' ];

				$itemCategory = $row[ 'itemCategoryName' ];

				$itemIDNumber = $row[ 'itemIDNumber' ];

				$query = "SELECT searchTag FROM searchableby WHERE itemName = '$itemName' AND itemCategory = '$itemCategory'";

				$searchTags = mysqli_query( $databaseConnection, $query );

				$resultArray[ 'activeItems' ][ $i ][ 'searchTags' ] = array();

				if( mysqli_num_rows( $searchTags ) != 0 )
				{
					$j = 0;

					while( $row = mysqli_fetch_array( $searchTags ) )
					{
						$resultArray['activeItems'][$i]['searchTags'][$j] = $row[0];

						$j += 1;
					}
				}

				$query = "SELECT dateCheckedOut FROM checkouthistory WHERE itemIDNumber = '$itemIDNumber' ORDER BY dateCheckedOut DESC";

				$dates = mysqli_query( $databaseConnection, $query );

				if( mysqli_num_rows( $dates ) != 0 )
				{
					$j = 1;

					while( $row = mysqli_fetch_array( $dates ) )
					{
						$resultArray['activeItems'][$i]['timesCheckedOut'] = $j;

						$resultArray['activeItems'][$i]['dateCheckedOut'] = $row[0];

						$j += 1;
					}
				}
				else
				{
					$resultArray['activeItems'][$i]['timesCheckedOut'] = 0;

					$resultArray['activeItems'][$i]['dateCheckedOut'] = "-";
				}

				$i += 1;
			}
		}

		$query = "SELECT * FROM disposeditem, individualitem WHERE disposeditem.itemIDNumber = individualitem.idNumber";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( mysqli_num_rows( $queryResult ) != 0 )
		{
			while( $row = mysqli_fetch_assoc( $queryResult ) )
			{
				$resultArray[ 'disposedItems' ][] = $row;
			}
		}

		return $resultArray;
	}

	function GetAllItemData( $databaseConnection, $itemID )
	{
		$query = "SELECT itemName, itemCategoryName FROM individualitem WHERE idNumber = $itemID AND idNumber IN ( SELECT itemIdNumber FROM activeitem )";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( mysqli_num_rows( $queryResult ) == 0 )
		{
			return "";
		}

		$row = mysqli_fetch_assoc( $queryResult );

		$data = array();

		foreach( $row as $key => $value )
		{
			$data[ $key ] = $value;
		}

		$query = "SELECT * FROM activeitem WHERE itemIDNumber = '$itemID'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		$row = mysqli_fetch_assoc( $queryResult );

		foreach( $row as $key => $value )
		{
			$data[ $key ] = $value;
		}

		$itemName = $databaseConnection->real_escape_string( $data[ 'itemName' ] );

		$itemCategory = $databaseConnection->real_escape_string( $data[ 'itemCategoryName' ] );

		$query = "SELECT description FROM item WHERE name ='". $itemName. "' AND itemCategory ='". $itemCategory. "'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		$row = mysqli_fetch_assoc( $queryResult );

		$data['description'] = $row['description'];

		$query = "SELECT text, dateAdded FROM note WHERE itemNumber = '$itemID'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( mysqli_num_rows( $queryResult ) != 0 )
		{
			$index = 0;

			while( $row = mysqli_fetch_assoc( $queryResult ) )
			{
				$data['itemNotes'][ $index ] = $row;

				$index += 1;
			}
			$data['notes'] = $data['itemNotes'][0]['text'];
		}

		$query = "SELECT searchTag FROM searchableby WHERE itemName ='". $itemName. "' AND itemCategory ='". $itemCategory. "'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( mysqli_num_rows( $queryResult ) != 0 )
		{
			$index = 0;

			while( $row = mysqli_fetch_array( $queryResult ) )
			{
				$data['searchTags'][ $index ] = $row[ 0 ];

				$index += 1;
			}
			$data['searchTags'] = implode(",", $data['searchTags']);
		}

		return $data;
	}

	function DeleteItemFromPrintQueue( $databaseConnection, $idNumber )
	{
		$query = "DELETE FROM printqueue WHERE itemIDNumber = '$idNumber'";

		$queryResult = mysqli_query( $databaseConnection, $query );
	}

	function DeleteItemFromDatabase( $databaseConnection, $idNumber )
	{
		// Delete the item from disposed, print queue, active item, and individual item
		//$row = mysqli_fetch_array( $queryResult );

		$query = "DELETE FROM activeitem WHERE itemIDNumber = '$idNumber'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		$query = "DELETE FROM note WHERE itemNumber = '$idNumber'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		$query = "SELECT itemCategoryName, itemName FROM individualitem WHERE idNumber = '$idNumber'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		$row = mysqli_fetch_assoc( $queryResult );

		$itemName = $row['itemName'];

		$itemCategory = $row['itemCategoryName'];

		$query = "SELECT count(*) FROM individualitem WHERE itemName = '$itemName' AND itemCategoryName = '$itemCategory'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		$row = mysqli_fetch_array( $queryResult );

		// Here we check to see if it is the last item of it's kind
		// And if so, then delete all traces of it so we don't have vestiges in the database
		if( $row[0] == 1 )
		{

			$query = "SELECT searchTag FROM searchableby WHERE itemName = '$itemName' AND itemCategory = '$itemCategory'";

			$queryResult = mysqli_query( $databaseConnection, $query );

			$searchTags = array();

			if( mysqli_num_rows( $queryResult ) > 0 )
			{
				$index = 0;

				while( $row = mysqli_fetch_array( $queryResult ) )
				{
					$searchTags[ $index ] = $row[0];

					$index += 1;
				}
			}

			$query = "DELETE FROM searchableby WHERE itemName = '$itemName' AND itemCategory = '$itemCategory'";

			$queryResult = mysqli_query( $databaseConnection, $query );

			foreach( $searchTags as $searchTag )
			{
				$query = "DELETE FROM searchtag WHERE name = '$searchTag'";

				mysqli_query( $databaseConnection, $query );
			}

			$query = "DELETE FROM individualitem WHERE idNumber = '$idNumber'";

			$queryResult = mysqli_query( $databaseConnection, $query );

			$query = "DELETE FROM item WHERE name = '$itemName' AND itemCategory = '$itemCategory'";

			$queryResult = mysqli_query( $databaseConnection, $query );

			$query = "DELETE FROM itemCategory WHERE name = '$itemCategory'";

			$queryResult = mysqli_query( $databaseConnection, $query );

		}
		else if ( $row[0] > 1 )
		{

			$query = "DELETE FROM individualitem WHERE idNumber = '$idNumber'";

			$queryResult = mysqli_query( $databaseConnection, $query );
		}

		else if ( $row[0] > 1 )
		{
			$query = "DELETE FROM individualitem WHERE idNumber = '$idNumber'";

			$queryResult = mysqli_query( $databaseConnection, $query );
		}
	}

	function UpdateIndividualItem( $databaseConnection, $idNumber, $itemCategory, $itemName )
	{
		$query = "INSERT IGNORE INTO individualitem( idNumber, itemCategoryName, itemName ) values( '$idNumber', '$itemCategory', '$itemName' )";

		$queryResult = mysqli_query( $databaseConnection, $query );
	}

	function DeleteActiveItem( $databaseConnection, $idNumber )
	{
		$query = "DELETE FROM activeitem WHERE itemIDNumber = '$idNumber'";

		mysqli_query( $databaseConnection, $query );

		$query = "DELETE FROM printqueue WHERE itemIDNumber = '$idNumber";

		mysqli_query( $databaseConnection, $query );
	}

	function InsertDisposalMethod( $databaseConnection, $method )
	{
		$query = "INSERT IGNORE INTO disposalmethod( description ) values( '$method' )";

		mysqli_query( $databaseConnection, $query );
	}

	function InsertDisposedItem( $databaseConnection, $idNumber, $method, $reason, $date )
	{
		$query = "INSERT IGNORE INTO disposeditem( itemIDNumber, disposalMethod, disposalDate, disposalReason ) values( '$idNumber', '$method', '$date', '$reason' )";

		mysqli_query( $databaseConnection, $query );
	}

	function SelectItemDataForSearchDisplay( $databaseConnection )
	{
		$query = "SELECT itemName, itemCategoryName, itemIDNumber, checkedOutUserEmail, buildingIn, roomIn, shelfUnitIn, shelfIn, abbreviation FROM activeitem, individualitem, building WHERE activeitem.itemIDNumber = individualitem.idNumber AND buildingIn = building.name";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( mysqli_num_rows( $queryResult ) != 0 )
		{
			$index = 0;

			while( $row = mysqli_fetch_assoc( $queryResult ) )
			{
				$resultArray[ 'activeItems' ][ $index ] = $row;

				$itemName = $row[ 'itemName' ];

				$itemCategory = $row[ 'itemCategoryName' ];

				$query = "SELECT searchTag FROM searchableby WHERE itemName = '$itemName' AND itemCategory = '$itemCategory'";

				$searchTags = mysqli_query( $databaseConnection, $query );

				$resultArray[ 'activeItems' ][ $index ][ 'searchTags' ] = array();

				if( mysqli_num_rows( $searchTags ) != 0 )
				{
					$j = 0;

					while( $row = mysqli_fetch_array( $searchTags ) )
					{
						$resultArray['activeItems'][ $index ][ 'searchTags' ][ $j ] = $row[ 0 ];

						$j += 1;
					}
				}

				$index += 1;
			}
		}

		return $resultArray;
	}


	function GetCheckoutHistoryDatesAndCounts( $databaseConnection){

		$query = "SELECT * FROM checkouthistory";

		$queryResult = mysqli_query( $databaseConnection, $query );

		$resultArray = [];

		$keyValueArray = [];

		if( mysqli_num_rows( $queryResult ) != 0 )
		{
			while( $row = mysqli_fetch_assoc( $queryResult ) )
			{
				if(!isset($resultArray[ $row[ "dateCheckedOut" ] ] )){
					$resultArray[ $row[ "dateCheckedOut" ] ] = 1;
				}else{
					$resultArray[ $row[ "dateCheckedOut" ] ] += 1;
				}
			}
		}

		foreach($resultArray as $key => $value){
			$keyValueArray[$key] =  $value;
		}

		return $keyValueArray;
	}

	function GetTotalCheckedOutItems( $databaseConnection ){

		$query = "SELECT * FROM activeitem WHERE checkedOutUserEmail <> 'NULL'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		return mysqli_num_rows( $queryResult ) != 0 ? mysqli_num_rows( $queryResult ) : 0;

	}

	function GetItemCategoryTotals( $databaseConnection )
	{
		$query = "SELECT COUNT(itemCategoryName), itemCategoryName FROM individualitem WHERE idNumber IN ( SELECT itemIdNumber FROM activeitem ) GROUP BY itemCategoryName";

		$queryResult = mysqli_query( $databaseConnection, $query );

		$resultArray = [];

		if( mysqli_num_rows( $queryResult ) != 0 )
		{
			while( $row = mysqli_fetch_assoc( $queryResult ) )
			{
				$resultArray[] = $row;
			}
		}

		return $resultArray;
	}

	function GetSingleItemDataForExport( $databaseConnection, $itemId )
	{
		$query = "SELECT individualitem.itemName, activeitem.itemIDNumber FROM activeitem JOIN individualitem ON activeitem.itemIDNumber = individualitem.idNumber WHERE itemIDNumber = '$itemId'";

		$queryResults = mysqli_query( $databaseConnection, $query );

		$row = mysqli_fetch_assoc( $queryResults );

		$data = array();

		foreach( $row as $key => $value )
		{
			$data[ $key ] = $value;
		}

		$query = "SELECT user.name, checkouthistory.itemIDNumber, checkouthistory.dateCheckedOut, checkouthistory.dateCheckedIn FROM checkouthistory JOIN user ON checkouthistory.userEmail = user.email WHERE checkouthistory.itemIDNumber = '$itemId'";

		$queryResults = mysqli_query( $databaseConnection, $query );

		if( mysqli_num_rows( $queryResults ) != 0 )
		{
			while( $row = mysqli_fetch_assoc( $queryResults ) )
			{
				$data[ 'checkoutHistory' ][] = $row;
			}
		}

		return $data;

	}

	function InsertIntoCheckoutHistory( $databaseConnection, $userId, $item )
	{
		$statement = $databaseConnection->prepare( "INSERT INTO checkouthistory VALUES( ?, ?, ?, null )" );

		$statement->bind_param( "sis", $user, $itemNumber, $date );

		$today = getdate();

		$year = $today['year'];

		$month = $today['mon'];

		$day = $today['mday'];

		$date = "$year-$month-$day";

		$user = $userId;

		$itemNumber = $item;

		$statement->execute();

		$statement->close();

		$statement = $databaseConnection->prepare( "UPDATE activeitem SET checkedOutUserEmail = ?, checkedOutDate = ? WHERE itemIDNumber = ?" );

		$statement->bind_param( "ssi", $user, $date2, $itemNumber );

		$user = $userId;

		$itemNumber = $item;

		$date2 = $date;

		$statement->execute();
	}

	function UpdateItemOnCheckIn( $databaseConnection, $itemId )
	{
		$statement = $databaseConnection->prepare( "UPDATE checkouthistory SET dateCheckedIn = ? WHERE itemIDNumber = ? AND dateCheckedIn is null" );

		$statement->bind_param( "si", $date, $item);

		$today = getdate();

		$year = $today['year'];

		$month = $today['mon'];

		$day = $today['mday'];

		$date = "$year-$month-$day";

		$item = $itemId;

		$statement->execute();

		$statement->close();

		$statement = $databaseConnection->prepare( "UPDATE activeitem SET checkedOutUserEmail = null, checkedOutDate = null WHERE itemIDNumber = ?" );

		$statement->bind_param( "i", $item );

		$item = $itemId;

		$statement->execute();
	}

	function UpdateItemQuery( $databaseConnection, $itemName, $itemCategory, $building, $buildingAbbreviation, $room, $departmentName, $departmentAbbreviation, $shelfUnit, $shelf, $itemDescription, $itemNote, $searchTagArray, $usePeriod, $idNumber )
	{

		$query = "SELECT * from individualitem WHERE itemName IN ( SELECT itemName FROM individualitem WHERE idNumber = $idNumber ) AND itemCategoryName IN ( SELECT itemCategoryName FROM individualitem WHERE idNumber = $idNumber )";

		$queryResult = mysqli_query( $databaseConnection, $query );

		$lastItem = false;

		$oldName = "";

		$oldCategory = "";

		if( mysqli_num_rows( $queryResult ) == 1 )
		{
			$result = mysqli_fetch_assoc( $queryResult );

			$oldName = $result[ 'itemName' ];

			$oldCategory = $result[ 'itemCategoryName' ];

			if( $oldName != $itemName || $oldCategory != $itemCategory )
			{
				$lastItem = true;
			}
		}

		$query = "INSERT IGNORE INTO itemcategory VALUES( '$itemCategory' )";

		mysqli_query( $databaseConnection, $query );

		$query = "INSERT IGNORE INTO item VALUES( '$itemName', '$itemCategory', '$itemDescription' )";

		mysqli_query( $databaseConnection, $query );

		if( $lastItem == true )
		{
			$query = "DELETE FROM searchableby WHERE itemName = '$oldName' AND itemCategory = '$oldCategory'";

			mysqli_query( $databaseConnection, $query );

			$query = "DELETE FROM item WHERE name = '$oldName' AND itemCategory = '$oldCategory'";

			mysqli_query( $databaseConnection, $query );
		}

		$file = fopen( 'debug.txt', 'w' );

		$query = "DELETE FROM searchableby WHERE itemName = '$itemName' AND itemCategory = '$itemCategory'";

		mysqli_query( $databaseConnection, $query );

		foreach( $searchTagArray as $tag )
		{
			$query = "INSERT IGNORE INTO searchtag VALUES( '$tag' )";

			mysqli_query( $databaseConnection, $query );

			$query = "INSERT IGNORE INTO searchableby VALUES( '$itemName', '$itemCategory', '$tag' )";

			mysqli_query( $databaseConnection, $query );
		}

		$query = "UPDATE individualitem SET itemCategoryName = '$itemCategory', itemName = '$itemName' WHERE idNumber = $idNumber";

		mysqli_query( $databaseConnection, $query );

		$query = "INSERT IGNORE INTO building VALUES( '$building', '$buildingAbbreviation' )";

		mysqli_query( $databaseConnection, $query );

		$query = "INSERT IGNORE INTO room VALUES( $room, '$building' )";

		mysqli_query( $databaseConnection, $query );

		$query = "INSERT IGNORE INTO shelfunit VALUES( $shelfUnit, $room, '$building' )";

		mysqli_query( $databaseConnection, $query );

		$query = "INSERT IGNORE INTO shelf VALUES( $shelf, $shelfUnit, $room, '$building' )";

		mysqli_query( $databaseConnection, $query );

		$query = "INSERT IGNORE INTO department VALUES( '$departmentName', '$departmentAbbreviation' )";

		mysqli_query( $databaseConnection, $query );

		$query = "UPDATE activeitem SET department = '$departmentName', buildingIn = '$building', roomIn = $room, shelfUnitIn = $shelfUnit, shelfIn = $shelf, usePeriod = $usePeriod WHERE itemIDNumber =  $idNumber";

		mysqli_query( $databaseConnection, $query );

		$query = "UPDATE note SET text='$itemNote' WHERE itemNumber='$idNumber'";

		mysqli_query( $databaseConnection, $query );

		/*
		if( $lastItem == true )
		{
			$query = "DELETE FROM searchableby WHERE itemName = '$oldName' AND itemCategory = '$oldCategory'";

			mysqli_query( $databaseConnection, $query );

			//$query = "DELETE FROM item WHERE name = '$oldName' AND itemCategory = '$oldCategory' AND name <> '$itemName' AND itemCategory <> '$itemCategory'";

			fwrite( $file, $query . "\n");

			mysqli_query( $databaseConnection, $query );
		}
		*/

		$query = "UPDATE item SET description = '$itemDescription' WHERE name = '$itemName' AND itemCategory = '$itemCategory'";

		mysqli_query( $databaseConnection, $query );
	}
?>
