<?php
	
	require_once '../DatabaseConnection.php';
	
	include 'LocationDataQueries.php';

	$locations = json_encode( GetAllLocationsAs2DArray( $databaseConnection ) );

	$data = $locations != "null" ? $locations : "";

	echo $data;
?>