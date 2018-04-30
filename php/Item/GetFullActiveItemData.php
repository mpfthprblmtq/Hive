<?php 

	// This file will retrieve all data for a particular active item
	// Requires an item number to do it

	require_once '../DatabaseConnection.php';

	include 'ItemDatabaseQueries.php';

	$itemID = $_GET['id'];

	$results = array();

	$results = GetAllItemData( $databaseConnection, $itemID );

	echo json_encode( $results );
?>