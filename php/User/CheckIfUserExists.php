<?php

	require_once '../DatabaseConnection.php';

	include_once 'UserQueries.php';

	include_once '../ChromePhp.php';

	$data = file_get_contents("php://input");

	$data = json_decode( $data, true );

	$input = $data['input'];

	$result = CheckIfUserExists( $databaseConnection, $input );

	echo $result;
?>
