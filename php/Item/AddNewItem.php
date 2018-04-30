<?php

	// This php file is responsible for adding new items into the database
	// It requires the item name, item category, and the full location the item will be stored at 
	// while not checked out (building name, room number, shelf unit number, shelf number )
	// An item description is optional. Will be set to nothing if nothing is provided.

	// This creates database connection
	require_once '../DatabaseConnection.php'; 

	// This file has function for adding to print queue table

	include '../Print/PrintDataQueries.php';
	include '../Location/LocationDataQueries.php';
	include 'ItemDatabaseQueries.php';
	
	// Get the data from POST and store it in variables for use in the queries later

	$data = file_get_contents("php://input");

	$data = json_decode( $data, true );

	// Pull the data from the post and process it ready for use
	$itemName = $databaseConnection->real_escape_string( $data[ 'itemName' ] );

	$itemCategory = $databaseConnection->real_escape_string( $data[ 'itemCategory' ] );

	$building = $databaseConnection->real_escape_string( $data[ 'building' ] );

	$buildingAbbreviaton = $databaseConnection->real_escape_string( $data[ 'buildingAbbreviation' ] );

	$room = $data[ 'room' ];

	$departmentName = $databaseConnection->real_escape_string( $data[ 'department' ] );

	$departmentAbbreviaton = $databaseConnection->real_escape_string( $data[ 'departmentAbbreviation' ] );

	$shelfUnit = $data[ 'shelfunit' ];

	$shelf = $data[ 'shelf' ];

	$itemDescription = $databaseConnection->real_escape_string( $data[ 'description' ] );

	$itemNote = $databaseConnection->real_escape_string( $data[ 'note' ] );

	$searchTags = $databaseConnection->real_escape_string( $data[ 'searchTags' ] );

	$searchTagArray =  array();

	$searchTagArray = explode( ' ', $searchTags );

	$usePeriod = $data[ 'usePeriod' ];

	$user800number = $data[ '800number' ];
	// Done pulling data and processing it, now use it!

	// Add the item category into the itemCategory table
	InsertItemCategory( $databaseConnection, $itemCategory );

	// Insert the department
	InsertDepartment( $databaseConnection, $departmentName, $departmentAbbreviaton );

	// Insert the item into the item table now
	InsertItem( $databaseConnection, $itemCategory, $itemName, $itemDescription );		

	// Now add the item to the individual item table
	$idNumber = InsertIndividualItem( $databaseConnection, $itemCategory, $itemName );

	// This will generate the required location insertions into the database
	InsertShelfIntoShelfUnit( $databaseConnection, $building, $buildingAbbreviaton, $room, $shelfUnit, $shelf );

	// Now that the item instance exists in the database, let's make it active and available to check out!
	InsertActiveItem( $databaseConnection, $idNumber, $departmentName, $building, $room, $shelfUnit, $shelf, $usePeriod );

	// If there were any notes provided, get the date and then insert the note into the note table
	if( $itemNote != '' )
	{
		$today = getdate();

		$year = $today['year'];

		$month = $today['mon'];

		$day = $today['mday'];

		$date = "$year-$month-$day";

		InsertNote( $databaseConnection, $idNumber, $itemNote, $date );
	} 
	else // There is no note, put in the date with no note
	{
		$today = getdate();

		$year = $today['year'];

		$month = $today['mon'];

		$day = $today['mday'];

		$date = "$year-$month-$day";

		InsertNote( $databaseConnection, $idNumber, '', $date );
	}

	// If there were search tags given, then insert them into the database now
	foreach( $searchTagArray as $searchTag )
	{
		InsertSearchTag( $databaseConnection, $searchTag );

		InsertSearchableBy( $databaseConnection, $searchTag, $itemName, $itemCategory );
	}

	// Add the new item to the print queue so it can be printed later at user's descreation
	AddItemToPrintQueue( $databaseConnection, $idNumber, $user800number );

	//$databaseConnection->close();
?>
