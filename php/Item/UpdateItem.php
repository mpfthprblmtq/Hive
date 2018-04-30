<?php

	require_once '../DatabaseConnection.php';

	include '../ChromePhp.php';

	include_once 'ItemDatabaseQueries.php';

	include_once '../Location/LocationDataQueries.php';

	$data = file_get_contents("php://input");

	$data = json_decode( $data, true );

	// Pull the data from the post and process it ready for use
	$itemName = $databaseConnection->real_escape_string( $data[ 'itemName' ] );

	$itemCategory = $databaseConnection->real_escape_string( $data[ 'itemCategory' ] );

	$building = $databaseConnection->real_escape_string( $data[ 'building' ] );

	$buildingAbbreviation = $databaseConnection->real_escape_string( $data[ 'buildingAbbreviation' ] );

	$room = $data[ 'room' ];

	$departmentName = $databaseConnection->real_escape_string( $data[ 'department' ] );

	$departmentAbbreviation = $databaseConnection->real_escape_string( $data[ 'departmentAbbreviation' ] );

	$shelfUnit = $data[ 'shelfunit' ];

	$shelf = $data[ 'shelf' ];

	$itemDescription = $databaseConnection->real_escape_string( $data[ 'description' ] );

	$itemNote = $databaseConnection->real_escape_string( $data[ 'note' ] );

	$searchTags = $databaseConnection->real_escape_string( $data[ 'searchTags' ] );

	$searchTagArray =  array();

	$searchTagArray = explode( ' ', $searchTags );

	$usePeriod = $data[ 'usePeriod' ];

	$idNumber = $data['idNumber'];

	UpdateItemQuery( $databaseConnection, $itemName, $itemCategory, $building, $buildingAbbreviation, $room, $departmentName, $departmentAbbreviation, $shelfUnit, $shelf, $itemDescription, $itemNote, $searchTagArray, $usePeriod, $idNumber );
?>
