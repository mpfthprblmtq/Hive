<?php

	require_once '../DatabaseConnection.php';

	include_once '../Location/LocationDataQueries.php';

	$data = file_get_contents("php://input");

	$data = json_decode( $data, true );

	$building = $databaseConnection->real_escape_string( $data['building'] );

	$room = $databaseConnection->real_escape_string( $data['room'] );

	$shelfUnit = $databaseConnection->real_escape_string( $data['shelfUnit'] );

	$shelf = $databaseConnection->real_escape_string( $data['shelf'] );

	$user800Number = $databaseConnection->real_escape_string( $data['user800Number'] );

	AddAllItemsInShelfToPrintQueue( $databaseConnection, $building, $room, $shelfUnit, $shelf, $user800Number );

?>