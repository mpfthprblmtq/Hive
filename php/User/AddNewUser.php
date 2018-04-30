<?php

	require_once '../DatabaseConnection.php';

	include_once 'UserQueries.php';

	$data = file_get_contents("php://input");

	$data = json_decode( $data, true );

	$cardNumber = $data['cardNumber'] != null ? $data['cardNumber'] : null;

	$idNumber = $data[ 'idNumber' ] != null ? $data['idNumber'] : null;

	$email = $data['email'];

	$name = $data[ 'name' ];

	$phoneNumber = $data[ 'phoneNumber' ];

	$selfServe = $data[ 'selfServe' ];

	InsertNewUser( $databaseConnection, $cardNumber, $idNumber, $name, $email, $phoneNumber, $selfServe );

	InsertIntoActiveUser( $databaseConnection, $email );

?>
