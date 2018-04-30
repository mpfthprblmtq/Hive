<?php

	require_once '../DatabaseConnection.php';

	include_once 'ItemDatabaseQueries.php';

	$data = SelectItemDataForSearchDisplay( $databaseConnection );

	$data = json_encode( $data );

	echo $data;
?>