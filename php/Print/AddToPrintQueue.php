<?php
	// This file will add items to the print queue table
	// If database connection given is not valid, then it will make one

	require_once '../DatabaseConnection.php';
	include_once 'PrintDataQueries.php';

	$itemNumber = $_POST['itemNumber'];

	$user800number = $_POST['800number'];

	AddItemToPrintQueue( $databaseConnection, $itemIDNumber, $user800number );

	$databaseConnection->close();
?>