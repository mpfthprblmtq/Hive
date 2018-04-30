<?php

	// This file will retrieve all data for a particular active item
	// Requires an item number to do it

	require_once '../DatabaseConnection.php';

	include 'UserQueries.php';

	$email = $_GET['email'];

	$results = GetUserData( $databaseConnection, $email );

	echo json_encode( $results );
?>
