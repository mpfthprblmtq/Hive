<?php
	
	require_once '../DatabaseConnection.php';

	include_once 'LocationDataQueries.php';

	$data = file_get_contents("php://input");

	$data = json_decode( $data, true );

	$oldBuilding = $databaseConnection->real_escape_string( $data['oldBuilding'] );

	$newBuilding = $databaseConnection->real_escape_string( $data['newBuilding'] );

	$oldRoom = $databaseConnection->real_escape_string( $data['oldRoom'] );

	$newRoom = $databaseConnection->real_escape_string( $data['newRoom'] );

	$oldShelfUnit = $databaseConnection->real_escape_string( $data['oldShelfUnit'] );

	$newShelfUnit = $databaseConnection->real_escape_string( $data['newShelfUnit'] );

	$oldShelf = $databaseConnection->real_escape_string( $data['oldShelf'] );

	$newShelf = $databaseConnection->real_escape_string( $data['newShelf'] );

	if( $oldBuilding != $newBuilding )
	{
		UpdateBuilding( $databaseConnection, $oldBuilding, $newBuilding );
	}

	if( $oldRoom != $newRoom )
	{
		UpdateRoom( $databaseConnection, $newBuilding, $oldRoom, $newRoom );
	}

	if( $oldShelfUnit != $newShelfUnit )
	{
		UpdateShelfUnit( $databaseConnection, $newBuilding, $newRoom, $oldShelfUnit, $newShelfUnit );
	}

	if( $oldShelf != $newShelf )
	{
		UpdateShelf( $databaseConnection, $newBuilding, $newRoom, $newShelfUnit, $oldShelf, $newShelf );
	}
?>