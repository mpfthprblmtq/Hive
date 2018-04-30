<?php

	require_once '../DatabaseConnection.php';

	include_once 'LocationDataQueries.php';

	$data = file_get_contents("php://input");

	$data = json_decode( $data, true );

	$building = $data['building'];

	$room = $data['room'];

	$shelfUnit = $data['shelfUnit'];

	$shelf = $data['shelf'];

	DeleteShelf( $databaseConnection, $building, $room, $shelfUnit, $shelf );

	DeleteShelfUnit( $databaseConnection, $building, $room, $shelfUnit );

	DeleteRoom( $databaseConnection, $building, $room );

	DeleteBuilding( $databaseConnection, $building );
?>
