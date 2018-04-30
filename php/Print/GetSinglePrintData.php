<?php
	// This function takes in a user id number and an item ID number and grab the information
	// for that item to be used for printing a label

	require_once '../DatabaseConnection.php';

	include 'PrintDataQueries.php';

	$itemNumber = $_GET['itemIDNumber'];

	$user800number = $_GET['800number'];

	$printData = GetSinglePrintData( $databaseConnection, $itemNumber, $user800number );

	$databaseConnection->close();

	echo $printData;
?>