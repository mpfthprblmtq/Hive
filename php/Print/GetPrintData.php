<?php
	// This function takes in a user id number
	// It will use this to query the print queue table and get the id number of all the items that user has selected to print
	// It will then use this to get all of the data needed for printing the barcode label for that item instance
	// It will also remove the selected item numbers completely from the print queue, even if another user had it queued up
 	// The logic behind that is users will only want to print one label globally for any particular item, so if one prints it, 
	// no one else needs to worry about it

	require_once '../DatabaseConnection.php';

	include 'PrintDataQueries.php';

	$user800number = $_GET['800number'];

	$printData = GetPrintData( $databaseConnection, $user800number );

	$databaseConnection->close();

	echo $printData;
?>