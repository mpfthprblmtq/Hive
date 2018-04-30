<?php
	require_once '../DatabaseConnection.php';
	
	include_once 'ItemDatabaseQueries.php';

	$data = file_get_contents("php://input");

	$data = json_decode( $data, true );

	$idNumber = $data['itemID'];

	$method = $data['disposalMethod'];

	$method = $databaseConnection->real_escape_string( $method );

	$reason = $data['reason'];

	$reason = $databaseConnection->real_escape_string( $reason );

	DeleteActiveItem( $databaseConnection, $idNumber );

	InsertDisposalMethod( $databaseConnection, $method );

	$today = getdate();

	$year = $today['year'];

	$month = $today['mon'];

	$day = $today['mday'];

	$date = "$year-$month-$day";

	InsertDisposedItem( $databaseConnection, $idNumber, $method, $reason, $date );
?>