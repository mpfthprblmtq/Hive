<?php

	require_once '../DatabaseConnection.php';

	include_once 'ItemDatabaseQueries.php';

	include_once '../Location/LocationDataQueries.php';

	$data = file_get_contents("php://input");

	$data = json_decode( $data, true );

	$email = $data[ 'userEmail' ];

	$query = "SELECT itemIDNumber, itemName FROM activeitem, individualitem WHERE activeitem.itemIDNumber = individualitem.idNumber AND checkedOutUserEmail = '$email'";

	$queryResult = msyqli_query( $databaseConnection, $query );

	$resultArray = array();

	if( mysqli_num_rows( $results ) != 0 )
	{
		while( $row = mysqli_fetch_assoc( $results ) )
		{
			$resultArray[] = $row;
		}
	}

	echo $jsonData = json_encode( $resultArray );

?>