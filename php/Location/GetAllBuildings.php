<?php
	
	// This file should be called when you want to get all the location data
	// It returns it as json data
	
	//require_once 'DatabaseConnection.php';

	include 'LocationDataQueries.php';

	function GetBuildings()
	{

	$buildings = array();

	$buildings = GetBuildings( $databaseConnection );

	//$buildings = json_encode( $buldings );

	return $buildings;
}
?>