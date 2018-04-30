<?php
	// This file should be called when you want to get all the location data
	// It returns it as json data

	/*
		Here is an example of what the data structure produced looks like

		$results = GetAllLocations( $databaseConnection );

		$building = $results['buildings'][0];

		$room = $results['rooms'][ $building ][0];

		$shelfunit = $results['shelfunits'][ $building ][ $room ][0];

		$shelf = $results['shelves'][ $building ][ $room ][ $shelfunit ][0];

		echo "$building, $room, $subroom, $shelfunit, $shelf"; 
	*/

	require_once '../DatabaseConnection.php';

	include 'LocationDataQueries.php';

	$buildings = GetBuildings( $databaseConnection );

	$rooms = array();

	$shelfUnits = array();

	$shelves = array();

	foreach( $buildings as $building => $buildingName )
	{
		$buildingQuery = $databaseConnection->real_escape_string( $buildingName );

		$rooms[ $buildingName ] = GetAllRoomsInBuilding( $databaseConnection, $buildingQuery );

		foreach( $rooms[ $buildingName ]as $room => $roomNumber )
		{
			$shelfUnits[ $buildingName ][ $roomNumber ] = GetAllShelfUnitsInRoom( $databaseConnection, $buildingQuery, $roomNumber );

			foreach( $shelfUnits[ $buildingName ][ $roomNumber ] as $shelfUnit => $shelfUnitNumber )
			{
				$shelfUnitNumber = $databaseConnection->real_escape_string( $shelfUnitNumber );
					
				$shelves[ $buildingName ][ $roomNumber ][ $shelfUnitNumber ] = GetAllShelvesInShelfUnit( $databaseConnection, $buildingQuery, $roomNumber, $shelfUnitNumber );
			}
		}
	}

	$returnArray = array();

	$returnArray[ 'buildings' ] = $buildings;

	$returnArray[ 'rooms' ] = $rooms;

	$returnArray[ 'shelfunits' ] = $shelfUnits;

	$returnArray[ 'shelves' ] = $shelves;

	$databaseConnection->close();

	echo json_encode( $returnArray );
?>
