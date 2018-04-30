<?php
	require_once '../DatabaseConnection.php';

	include_once 'UserQueries.php';

	$data = file_get_contents("php://input");

	$data = json_decode( $data, true );

	$email = $data[ 'email' ];

	DeleteFromActiveUser( $databaseConnection, $email );

	DeleteUser( $databaseConnection, $email );
?>
