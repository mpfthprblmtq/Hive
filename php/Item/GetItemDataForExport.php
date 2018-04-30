<?php

	require_once '../DatabaseConnection.php';

	include_once 'ItemDatabaseQueries.php';

	$itemId = $_GET['itemId'];

	$val = GetSingleItemDataForExport( $databaseConnection, $itemId );

	echo json_encode($val);
?>