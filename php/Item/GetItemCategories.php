<?php

// This file is responsible for returning the item categories stored in the database

// include and create database connection
require_once '../DatabaseConnection.php';

// build the query
$query = "SELECT * FROM itemcategory";

// do the query
$result = mysqli_query( $databaseConnection, $query );

// make a new array
$resultArr = array();

// store query results in new array
while($row = mysqli_fetch_assoc($result)) {
	array_push($resultArr, $row);
}

echo json_encode( $resultArr );

?>