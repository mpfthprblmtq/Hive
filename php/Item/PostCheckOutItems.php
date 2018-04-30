<?php

	require_once '../DatabaseConnection.php';

	include_once 'ItemDatabaseQueries.php';

	$data = file_get_contents("php://input");

	$data = json_decode( $data, true );

	foreach( $data[ 'items' ] as $item )
	{
		InsertIntoCheckoutHistory( $databaseConnection, $data['userEmail'], $item );
	}
?>