<?php
	// This function takes in a user id number
	// It will return the count of items in the Print Queue

	require_once '../DatabaseConnection.php';

	include 'PrintDataQueries.php';

	$user800number = $_GET['800number'];

	$printData = GetPrintDataCount( $databaseConnection, $user800number );

	$databaseConnection->close();

	echo $printData > 0 ? $printData : 0;
?>