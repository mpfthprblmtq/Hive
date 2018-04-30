<?php

	require_once '../DatabaseConnection.php';

	include_once 'UserQueries.php';

	$data = file_get_contents("php://input");

	$data = json_decode( $data, true );

	UpdateUser( $databaseConnection, $data['oldEmail'], $data[ 'newEmail' ], $data['name'], $data[ '800Number' ], $data[ 'cardNumber' ], $data[ 'selfServe' ], $data[ 'phoneNumber' ] );
?>