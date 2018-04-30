<?php

	require_once '../DatabaseConnection.php';

	include_once 'ItemDatabaseQueries.php';

	$data = GetTotalCheckedOutItems( $databaseConnection );

	$databaseConnection->close();

	echo $data;
?>