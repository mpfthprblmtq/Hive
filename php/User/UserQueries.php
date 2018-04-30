<?php

	function InsertIntoActiveUser( $databaseConnection, $email )
	{
		$statement = $databaseConnection->prepare( "INSERT INTO activeusers (email) values (?)" );

		$statement->bind_param("s", $a);

		$a = $email;

		$statement->execute();

	}

	function DeleteFromActiveUser( $databaseConnection, $email )
	{
		$statement = $databaseConnection->prepare( "DELETE FROM activeusers WHERE email = ?" );

		$statement->bind_param( "s", $a );

		$a = $email;

		$statement->execute();
	}

	function InsertNewUser( $databaseConnection, $cardNumber, $idNumber, $name, $email, $phoneNumber, $selfServe )
	{
		$statement = $databaseConnection->prepare( "INSERT INTO user( barcodeNumber, 800number, name, email, phoneNumber, selfServe ) values ( ?, ?, ?, ?, ?, ? )" );

		$statement->bind_param( "iisssi", $a, $b, $c, $d, $e, $f );

		$a = $cardNumber;

		$b = $idNumber;

		$c = $name;

		$d = $email;

		$e = $phoneNumber;

		$f = $selfServe;

		$statement->execute();
	}


	function GetUserData( $databaseConnection, $email)
	{
		$query = "SELECT * FROM user WHERE email = '$email'";

		$queryResults = mysqli_query( $databaseConnection, $query );

		if( !$queryResults )
		{
			echo "User retrieval error<br>";
			echo("Error description: " . mysqli_error($databaseConnection));
		}

		$row = mysqli_fetch_assoc( $queryResults );

		$data = array();

		foreach( $row as $key => $value )
		{
			$data[ $key ] = $value;
		}

		return $data;
	}

	function DeleteUser( $databaseConnection, $email )
	{
		$statement = $databaseConnection->prepare( "DELETE FROM user WHERE email = ?" );

		$statement->bind_param( "s", $a );

		$a = $email;

		$statement->execute();
	}

	function SelectAllActiveUsers( $databaseConnection )
	{
		$query = "SELECT * FROM user WHERE email IN ( SELECT email from activeusers )";

		$queryResults = mysqli_query( $databaseConnection, $query );

		if( !$queryResults )
		{
			echo "Item add error<br>";
			echo("Error description: " . mysqli_error($databaseConnection));
		}

		$resultArray = [];

		while( $row = mysqli_fetch_assoc( $queryResults ) )
		{
			$row["numItems"] = GetUserCheckedOutItemAmount($databaseConnection, $row["email"]);

			$row["checkoutHistory"] = GetUserCheckoutHistory($databaseConnection, $row["email"]);

			$resultArray[] = $row;
		}

		return $resultArray;
	}

	function SelectAllInactiveUsers( $databaseConnection )
	{
		$query = "SELECT * FROM user WHERE email NOT IN ( SELECT email From activeusers )";

		$queryResults = mysqli_query( $databaseConnection, $query );

		if( !$queryResults )
		{
			echo "Item add error<br>";
			echo("Error description: " . mysqli_error($databaseConnection));
		}

		$resultArray = [];

		while( $row = mysqli_fetch_assoc( $queryResults ) )
		{
			$resultArray[] = $row;
		}

		return $resultArray;
	}

	function GetUserCheckedOutItemAmount($databaseConnection, $email){

		$query = "SELECT COUNT(*) as total FROM activeitem WHERE checkedOutUserEmail = '$email'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		$data = mysqli_fetch_assoc($queryResult);

		return $data[ 'total' ];
	}

	function GetUserCheckOutHistory($databaseConnection, $email){

		$query = "SELECT checkouthistory.itemIDNumber, checkouthistory.dateCheckedOut, checkouthistory.dateCheckedIn, individualitem.itemName FROM checkouthistory JOIN individualitem ON checkouthistory.itemIDNumber = individualitem.idNumber WHERE checkouthistory.userEmail = '$email'";

		$queryResult = mysqli_query( $databaseConnection, $query );

		$resultArray = [];

		while( $row = mysqli_fetch_assoc( $queryResult ) )
		{
			$resultArray[] = $row;
		}

		return $resultArray;
	}

	function UpdateUser( $databaseConnection, $oldEmail, $newEmail, $newName, $new800Number, $newCardNumber, $selfServe, $phoneNumber )
	{

		$id800 = $new800Number;

		$card = $newCardNumber;

		$serve = $selfServe;

		$name = $newName;

		$email = $newEmail;

		$phone = $phoneNumber;

		$old = $oldEmail;

		$statement = $databaseConnection->prepare( "UPDATE user SET 800number=?, barcodeNumber=?, selfServe=?, name=?, email=?, phoneNumber=? WHERE email=?" );

		$statement->bind_param( "iiissss", $id800, $card, $serve, $name, $email, $phone, $old );

		$statement->execute();
	}

	function CheckIfUserExists( $databaseConnection, $data )
	{
		if( is_numeric( $data ) )
		{

			$statement = $databaseConnection->prepare( "SELECT name, email, selfServe FROM user WHERE 800number = ? OR barcodeNumber = ?");

			$statement->bind_param( "ii", $number, $number );

			$number = $data;

			$statement->execute();

			$result = $statement->get_result();

			$row = $result->fetch_assoc();

			if( $row == 0 )
			{
				return false;
			}

			else
			{
				return json_encode( $row );
			}
		}

		else
		{
			$statement = $databaseConnection->prepare( "SELECT name, email, selfServe FROM user WHERE email = ?");

			$statement->bind_param( "s", $email );

			$email = $data;

			$statement->execute();

			$result = $statement->get_result();

			$row = $result->fetch_assoc();

			if( $row == 0 )
			{
				return false;
			}

			else
			{
				return json_encode( $row );
			}
		}
	}
?>
