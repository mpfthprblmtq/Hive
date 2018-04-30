<?php

	require_once "../DatabaseConnection.php";

	include "UserQueries.php";

	$users = array();

	$users[ 'activeUsers' ] = SelectAllActiveUsers( $databaseConnection );

	$users[ 'inactiveUsers' ] = SelectAllInactiveUsers( $databaseConnection );

	echo json_encode( $users );

?>