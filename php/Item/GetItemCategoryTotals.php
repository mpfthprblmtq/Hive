<?php

	require_once '../DatabaseConnection.php';

	include_once 'ItemDatabaseQueries.php';

	$data = GetItemCategoryTotals( $databaseConnection );

	$databaseConnection->close();

	echo json_encode($data);
?>