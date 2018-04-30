<?php
	
	// This file holds query functions that are responsible for interacting with the print queue table in the database

	// This function adds an item to the print queue
	function AddItemToPrintQueue( $databaseConnection, $itemIDNumber, $user800number )
	{
		$query = "INSERT IGNORE INTO printqueue( itemIDNumber, user800number ) values( '$itemIDNumber', '$user800number' )";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( !$queryResult )
		{
			echo "Error adding to print queue table!";

			echo("Error description: " . mysqli_error($databaseConnection));
		}
	}

	// This function will return all items in the queue paired with the user's 800 number
	function GetPrintData( $databaseConnection, $user800Number )
	{
		// Get all the items this user has queued up
		$query = "SELECT itemIDNumber FROM printqueue WHERE user800Number = '$user800Number'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		if( mysqli_num_rows( $queryResult ) != 0 )
		{
			$itemIDnumbers = array();

			$index = 0;

			while( $idNumber = mysqli_fetch_array ( $queryResult ) )
			{
				$itemIDnumbers[ $index ] = $idNumber[0];

				$index += 1;
			}

			$printData = array();

			$index = 0;
			
			foreach( $itemIDnumbers as $itemNumber )
			{
				$query = "SELECT itemIDNumber, itemName, b.abbreviation AS bldgAbbr, roomIn, d.abbreviation AS deptAbbr, shelfUnitIn, shelfIn FROM activeitem, individualitem, building AS b, department AS d WHERE activeitem.itemIDNumber = '$itemNumber' AND individualitem.idNumber = '$itemNumber' AND b.name = activeitem.buildingIn AND d.name = activeitem.department";
				
				$queryResult = mysqli_query( $databaseConnection, $query );

				if( mysqli_num_rows( $queryResult ) != 0 )
				{
					while( $queryResultRow = mysqli_fetch_assoc( $queryResult ) )
					{
						$printData[] = $queryResultRow;

						$printData[ $index ]['itemIDNumber'] = sprintf( '%06d', $printData[ $index ][ 'itemIDNumber' ] );

					}
				}

				$index += 1;
			}

			return json_encode( $printData );
		}
	}

	// This function will return all items in the queue paired with the user's 800 number
	function GetSinglePrintData( $databaseConnection, $itemNumber, $user800Number )
	{
		// Get a single item for print
		$query = "SELECT itemIDNumber, itemName, b.abbreviation AS bldgAbbr, roomIn, d.abbreviation AS deptAbbr, shelfUnitIn, shelfIn FROM activeitem, individualitem, building AS b, department AS d WHERE activeitem.itemIDNumber = '$itemNumber' AND individualitem.idNumber = '$itemNumber' AND b.name = activeitem.buildingIn AND d.name = activeitem.department";
		
		$queryResult = mysqli_query( $databaseConnection, $query );

		if( mysqli_num_rows( $queryResult ) != 0 )
		{
			while( $queryResultRow = mysqli_fetch_assoc( $queryResult ) )
			{
				$printData[] = $queryResultRow;

				$printData[ 0 ]['itemIDNumber'] = sprintf( '%06d', $printData[ 0 ][ 'itemIDNumber' ] );

			}
		}

		return json_encode( $printData );
	}

	// This function will return the count of items in the queue paired with the user's 800 number
	function GetPrintDataCount( $databaseConnection, $user800Number )
	{
		// Get all the items this user has queued up
		$query = "SELECT itemIDNumber FROM printqueue WHERE user800Number = '$user800Number'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		return mysqli_num_rows($queryResult);
	}

	function PostRemovePrintDataFromPrintQueue( $databaseConnection, $user800Number )
	{
		// remove all from the table
		$query = "DELETE FROM printqueue WHERE user800Number = '$user800Number'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		return "All user items removed from Print Queue table.";
	}
?>