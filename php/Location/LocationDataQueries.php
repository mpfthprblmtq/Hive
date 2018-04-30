<?php

	include_once '../Print/PrintDataQueries.php';

	// This file includes many functions for retrieving and inserting data into the location tables

	function InsertBuilding( $databaseConnection, $buildingName, $buildingAbbreviation )
	{
		$query = "INSERT IGNORE INTO building( name, abbreviation ) values( '$buildingName', '$buildingAbbreviation' )";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			echo "Inserting into building table failed<br>";

			echo("Error description: " . mysqli_error($databaseConnection));

			return false;
		}

		return true;
	}

	function InsertRoomIntoBuilding( $databaseConnection, $buildingName, $buildingAbbreviation, $roomNumber )
	{
		if( InsertBuilding( $databaseConnection, $buildingName, $buildingAbbreviation ) )
		{
			$query = "INSERT IGNORE INTO room( number, buildingName ) values( '$roomNumber', '$buildingName' )";

			$queryResult = mysqli_query( $databaseConnection, $query );

			if( !$queryResult )
			{
				echo "Inserting into room table failed<br>";

				echo("Error description: " . mysqli_error($databaseConnection));

				return false;
			}

			return true;
		}

		else
		{
			return false;
		}
	}

	function InsertShelfUnitIntoRoom( $databaseConnection, $buildingName, $buildingAbbreviation, $roomNumber, $shelfUnitNumber )
	{
		if( InsertRoomIntoBuilding( $databaseConnection, $buildingName, $buildingAbbreviation, $roomNumber ) )
		{
			$query = "INSERT IGNORE INTO shelfunit( roomIn, buildingName, idNumber  ) values(  '$roomNumber', '$buildingName', '$shelfUnitNumber' )";

			$queryResult = mysqli_query( $databaseConnection, $query );

			if( !$queryResult )
			{
				echo "Inserting into shelfunit table failed<br>";

				echo("Error description: " . mysqli_error($databaseConnection));

				return false;
			}

			return true;
		}

		else
		{
			return false;
		}
	}

	function InsertShelfIntoShelfUnit( $databaseConnection, $buildingName, $buildingAbbreviation, $roomNumber, $shelfUnitNumber, $shelfNumber )
	{
		if( InsertShelfUnitIntoRoom( $databaseConnection, $buildingName, $buildingAbbreviation, $roomNumber, $shelfUnitNumber ) )
		{
			$query = "INSERT IGNORE INTO shelf( roomIn, buildingName, shelfUnitNumber, number  ) values( '$roomNumber', '$buildingName', '$shelfUnitNumber', '$shelfNumber' )";

			$queryResult = mysqli_query( $databaseConnection, $query );

			if( !$queryResult )
			{
				echo "Inserting into shelf table failed<br>";

				echo("Error description: " . mysqli_error($databaseConnection));

				return false;
			}

			return true;
		}

		else
		{
			return false;
		}
	}

	function GetBuildings( $databaseConnection )
	{
		$query = "SELECT name as buildingName FROM building";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			echo "Selecting from building table failed<br>";

			echo( "Error description: " . mysqli_error( $databaseConnection ) );

			return false;
		}

		$resultArray = array();

		if( mysqli_num_rows( $queryResult ) != 0 )
		{
			while( $queryResultRow = mysqli_fetch_assoc( $queryResult ) )
			{

				$name = $queryResultRow['buildingName'];

				array_push( $resultArray, $name );
			}
		}

		return $resultArray;
	}

	function GetAllRoomsInBuilding( $databaseConnection, $buildingName )
	{
		$query = "SELECT number as roomNumber FROM room WHERE buildingName = '$buildingName'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			echo "Selecting from room table failed<br>";

			echo( "Error description: " . mysqli_error( $databaseConnection ) );

			return false;
		}

		$resultArray = array();

		if( mysqli_num_rows( $queryResult ) != 0 )
		{
			while( $queryResultRow = mysqli_fetch_assoc( $queryResult ) )
			{
				$roomNumber = $queryResultRow['roomNumber'];

				array_push( $resultArray, $roomNumber );
			}
		}

		return $resultArray;
	}

	function GetAllShelfUnitsInRoom( $databaseConnection, $buildingName, $roomNumber )
	{
		$query = "SELECT idNumber as shelfUnit FROM shelfunit WHERE buildingName = '$buildingName' AND roomIn = '$roomNumber' ";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			echo "Selecting from room table failed<br>";

			echo( "Error description: " . mysqli_error( $databaseConnection ) );

			return false;
		}

		$resultArray = array();

		if( mysqli_num_rows( $queryResult ) != 0 )
		{
			while( $queryResultRow = mysqli_fetch_assoc( $queryResult ) )
			{
				$shelfUnit = $queryResultRow['shelfUnit'];

				array_push( $resultArray, $shelfUnit );
			}
		}

		return $resultArray;
	}

	function GetAllShelvesInShelfUnit( $databaseConnection, $buildingName, $roomNumber, $shelfUnitNumber )
	{
		$query = "SELECT number as shelfNumber FROM shelf WHERE buildingName = '$buildingName' AND roomIn = '$roomNumber' AND shelfUnitNumber = '$shelfUnitNumber'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			echo "Selecting from room table failed<br>";

			echo( "Error description: " . mysqli_error( $databaseConnection ) );

			return false;
		}

		$resultArray = array();

		if( mysqli_num_rows( $queryResult ) != 0 )
		{
			while( $queryResultRow = mysqli_fetch_assoc( $queryResult ) )
			{
				$shelf = $queryResultRow['shelfNumber'];

				array_push( $resultArray, $shelf );
			}
		}

		return $resultArray;
	}	

	function UpdateBuilding( $databaseConnection, $oldName, $newName )
	{
		$query = "UPDATE building SET name = '$newName' WHERE name = '$oldName'";

		$queryResult = mysqli_query( $databaseConnection, $query );
	}

	function UpdateRoom( $databaseConnection, $buildingName, $oldNumber, $newNumber )
	{
		$query = "UPDATE room SET number = '$newNumber' WHERE number = '$oldNumber' AND buildingName = '$buildingName'";

		$queryResult = mysqli_query( $databaseConnection, $query );
	}

	function UpdateShelfUnit( $databaseConnection, $buildingName, $roomNumber, $oldNumber, $newNumber )
	{
		$query = "UPDATE shelfunit SET idNumber = '$newNumber' WHERE idNumber = '$oldNumber' AND roomIn = '$roomNumber' AND buildingName = '$buildingName'";

		$queryResult = mysqli_query( $databaseConnection, $query );
	}

	function UpdateShelf( $databaseConnection, $buildingName, $roomNumber, $shelfUnit, $oldNumber, $newNumber )
	{
		$query = "UPDATE shelf SET number = '$newNumber' WHERE number = '$oldNumber' AND shelfUnitNumber = '$shelfUnit' AND roomIn = '$roomNumber' AND buildingName = '$buildingName'";

		$queryResult = mysqli_query( $databaseConnection, $query );
	}

	function DeleteShelf( $databaseConnection, $building, $room, $shelfUnit, $shelf )
	{
		$query = "DELETE FROM shelf WHERE buildingName = '$building' AND roomIn = '$room' AND shelfUnitNumber = '$shelfUnit' AND number = '$shelf'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			return mysqli_error( $databaseConnection );
		}
	}

	function DeleteShelfUnit( $databaseConnection, $building, $room, $shelfUnit )
	{
		$shelves = GetAllShelvesInShelfUnit( $databaseConnection, $building, $room, $shelfUnit );

		foreach( $shelves as $shelf )
		{
			DeleteShelf( $databaseConnection, $building, $room, $shelfUnit, $shelf );
		}

		$query = "DELETE FROM shelfunit WHERE buildingName = '$building' AND roomIn = '$room' AND idNumber = '$shelfUnit'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			return mysqli_error( $databaseConnection );
		}
	}

	function DeleteRoom( $databaseConnection, $building, $room )
	{

		$shelfUnits = GetAllShelfUnitsInRoom( $databaseConnection, $building, $room );
		
			foreach( $shelfUnits as $shelfUnit )
			{
				DeleteShelfUnit( $databaseConnection, $building, $room, $shelfUnit );
			}
		

		$query = "DELETE FROM room WHERE buildingName = '$building' AND number = '$room'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			return mysqli_error( $databaseConnection );
		}
	}

	function DeleteBuilding( $databaseConnection, $building )
	{
		$rooms = GetAllRoomsInBuilding( $databaseConnection, $building );

		foreach( $rooms as $room )
		{
			DeleteRoom( $databaseConnection, $building, $room );
		}

		$query = "DELETE FROM building WHERE name = '$building'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			return mysqli_error( $databaseConnection );
		}
	}

	function GetAllLocationsAs2DArray( $databaseConnection )
	{
		$query = "SELECT * FROM shelf";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			echo "Selecting from shelf failed<br>";

			echo( "Error description: " . mysqli_error( $databaseConnection ) );

			return false;
		}

		$resultArray = array();
 
		$statement = $databaseConnection->prepare( "SELECT count(*) FROM activeitem WHERE buildingIn=? AND roomIn=? AND shelfUnitIn=? AND shelfIn=?" );

		$statement->bind_param("siii", $building, $room, $shelfUnit, $shelf);

 		if( mysqli_num_rows( $queryResult ) != 0 )
 		{
			$index = 0;

 			while( $queryResultRow = mysqli_fetch_assoc( $queryResult ) )
 			{
 				array_push( $resultArray, $queryResultRow );

				$building = $resultArray[ $index ][ 'buildingName' ];

				$room = $resultArray[ $index ][ 'roomIn' ];

				$shelfUnit = $resultArray[ $index ][ 'shelfUnitNumber' ];

				$shelf = $resultArray[ $index ][ 'number' ];

				$statement->execute();

				$statement->bind_result( $count );

				$statement->fetch();

				$resultArray[ $index ][ 'numItems' ] = $count;

				$index += 1;
 			}
 
 			return $resultArray;
		}
	}

	function AddAllItemsInShelfToPrintQueue( $databaseConnection, $building, $room, $shelfUnit, $shelf, $user800Number )
	{
		$query = "SELECT * FROM activeitem WHERE buildingIn = '$building' AND roomIn = '$room' AND shelfUnitIn = '$shelfUnit' AND shelfIn = '$shelf'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			echo "Selecting from activeitem failed<br>";

			echo( "Error description: " . mysqli_error( $databaseConnection ) );

			return false;
		}

		if( mysqli_num_rows( $queryResult ) != 0 )
		{
			while( $queryResultRow = mysqli_fetch_assoc( $queryResult ) )
			{
				$itemIDNumber = $queryResultRow['itemIDNumber'];

				AddItemToPrintQueue( $databaseConnection, $itemIDNumber, $user800Number );
			}
		}
	}
?>
