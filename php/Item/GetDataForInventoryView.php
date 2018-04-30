<?php
	// This file is for getting data for the inventory view
	// It will be returned as a json object

	require_once '../DatabaseConnection.php';

	include_once 'ItemDatabaseQueries.php';

	$data = SelectDataForGeneralView( $databaseConnection );

	$databaseConnection->close();

	echo json_encode( $data );
?>