<?php

	// This file will query the database and get all of the item categories
	// Then return them as json data
	
	// Include and create database connection
	require_once '../DatabaseConnection.php';

	include 'ItemDatabaseQueries.php';

	$items = SelectAllItems( $databaseConnection );

	$databaseConnection->close();

	return $items;
?>