<?php

	require_once '../DatabaseConnection.php';

	include_once 'ItemDatabaseQueries.php';

	$data = file_get_contents("php://input");

	$data = json_decode( $data, true );

	$idNumber = $data['itemID'];

	DeleteItemFromPrintQueue( $databaseConnection, $idNumber );

	DeleteItemFromDatabase( $databaseConnection, $idNumber );

?>