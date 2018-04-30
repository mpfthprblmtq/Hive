<?php  

	require_once '../DatabaseConnection.php';

	$data = file_get_contents("php://input");

	$data = json_decode( $data, true );

	$statement = $databaseConnection->prepare( "SELECT password FROM admin WHERE 800number = ?" );

	$statement->bind_Param( "s", $number);

	$number = $data['number'];

	$number = mysqli_real_escape_string( $databaseConnection, $number );

	$password = $data['password'];

	$password = mysqli_real_escape_string( $databaseConnection, $password );

	$statement->execute();

	$statement->bind_result( $hash );

	$statement->fetch();

	if( $hash )
	{ 
		if( password_verify( $password, $hash ) )
		{
	        echo "true";

	        return;
	    }
	}
	
	// An inccorect password has been entered, pause the system to prevent brute force attempted access
	sleep(1);

	echo "Wrong Username or Password";

	return;
?>