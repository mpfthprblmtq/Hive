<?php
	// This function takes in a user id number and an item number
	// and adds a row to the printqueue table with the previous
	// mentioned fields

	require_once '../DatabaseConnection.php';

	include 'PrintDataQueries.php';

	$itemIDNumber = $_POST['itemIDNumber'];

	$user800number = $_POST['800number'];

	$result = AddItemToPrintQueue( $databaseConnection, $itemIDNumber, $user800number );

	$databaseConnection->close();

	echo $result;
?>