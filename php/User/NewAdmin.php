<?php

	require_once '../DatabaseConnection.php';

	$data = file_get_contents("php://input");

	$data = json_decode( $data, true );

	$name = $data['name'];

	$email = $data['email'];

	$password = $data['password'];

	$user800number = $data['800number'];

	$query = "INSERT INTO user(name, email, 800number) values('$name', '$email', '$user800number')";

	$queryResult = mysqli_query( $databaseConnection, $query );

	$password = password_hash( $password, PASSWORD_DEFAULT );

	$query = "INSERT INTO admin(800number, password) values('$user800number', '$password')";

	$queryResult = mysqli_query( $databaseConnection, $query );

?>
