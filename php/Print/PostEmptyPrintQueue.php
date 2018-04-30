<?php 

	// this removes all print data from the Print Queue; there is nothing to return

	require_once '../DatabaseConnection.php';

	include 'PrintDataQueries.php';

	$user800number = $_POST['800number'];

	PostRemovePrintDataFromPrintQueue( $databaseConnection, $user800number );

	$databaseConnection->close();

?>