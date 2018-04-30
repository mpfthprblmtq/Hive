<?php
	// This function takes in a user id number
	// It will return the count of items in the Print Queue

	require_once '../DatabaseConnection.php';

	include '../Item/ItemDatabaseQueries.php';

	$departments = GetDepartments( $databaseConnection );

	$databaseConnection->close();

	echo $departments;
?>
