<?php
	require_once '../DatabaseConnection.php';

	include_once 'LocationDataQueries.php';

	include '../ChromePhp.php';

	$data = file_get_contents("php://input");

	$data = json_decode( $data, true );

	$buildingName = $databaseConnection->real_escape_string( $data['building'] );	

	$roomNumber = $databaseConnection->real_escape_string( $data['room'] );

	$shelfUnitNumber = $databaseConnection->real_escape_string( $data['shelfUnit'] );

	$shelfNumber = $databaseConnection->real_escape_string( $data['shelf'] );

	$buildingAbbreviation = $databaseConnection->real_escape_string( $data['buildingAbbreviation']);

	if( $shelfNumber != "" )
	{
		InsertShelfIntoShelfUnit( $databaseConnection, $buildingName, $buildingAbbreviation, $roomNumber, $shelfUnitNumber, $shelfNumber );
	}

	else if( $shelfUnitNumber != "" )
	{
		InsertShelfUnitIntoRoom( $databaseConnection, $buildingName, $buildingAbbreviation, $roomNumber, $shelfUnitNumber );
	}

	else if( $roomNumber != "" )
	{
		InsertRoomIntoBuilding( $databaseConnection, $buildingName, $buildingAbbreviation, $roomNumber );
	}

	else
	{
		InsertBuilding( $databaseConnection, $buildingName, $buildingAbbreviation );
	}
?>