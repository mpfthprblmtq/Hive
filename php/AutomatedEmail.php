<?php

	require_once 'DatabaseConnection.php';

	$query = "SELECT DISTINCT checkedOutUserEmail FROM activeitem where checkedOutUserEmail IS NOT NULL";

	$queryResult = mysqli_query( $databaseConnection, $query );

	$headers = 'From: HIVE <hive@isg.siue.edu>' . "\r\n" . 'Reply-To: donotreply@hive.isg.siue.edu' . "\r\n" . 'X-Mailer: PHP/' . phpversion();

	if( mysqli_num_rows( $queryResult ) != 0 )
	{
		while( $row = mysqli_fetch_assoc( $queryResult ) )
		{
			$email = $row['checkedOutUserEmail'];

			$query = "SELECT checkedOutDate, usePeriod, itemName FROM activeitem, individualitem where activeitem.itemIDNumber = individualitem.idNumber AND checkedOutUserEmail = '$email'";

			$itemData = mysqli_query( $databaseConnection, $query );

			$oneDay = array();

			$today = array();

			$late = array();

			while( $row = mysqli_fetch_assoc( $itemData ) )
			{
				$dueDate = new DateTime( $row[ 'checkedOutDate' ] );

				date_add( $dueDate, date_interval_create_from_date_string("$temp days" ) );

				echo date_format( $dueDate, 'Y-m-d' );

				$interval = date_diff( new DateTime( date( 'Y-m-d' ) ), $dueDate );

				$daysLeft = (integer)$interval->format('%R%a');

				if( $daysLeft == 1 )
				{
					array_push( $oneDay, $row[ 'itemName' ] );
				}

				else if( $daysLeft == 0 )
				{
					array_push( $today, $row[ 'itemName' ] );
				}

				else if( $daysLeft < 0 )
				{
					array_push( $late, $row[ 'itemName' ] );
				}
			}

			if( sizeof( $oneDay ) > 0 )
			{
				$subject = "Reminder from IMC";

				$message = "The following materials are due tomorrow: ";

				foreach( $oneDay as $itemName )
				{
					$message += $itemName . " ";
				}

				$message += "\n";

				$message += "Please return materials to the Instructional Materials Center.  Thank you.";

				$message += "Brenda Cusanelli, Chief Clerk\n";

				$message += "Instructional Materials Center - SIUE\n";

				$message += "Founders Hall 1208\n";

				$message += "618-650-3494\n";

				$message += "bcusane@siue.edu";

				mail( $row['checkedOutUserEmail'], $subject, $message, $headers );
			}

			if( sizeof( $today ) > 0 )
			{
				$subject = "Reminder from IMC";

				$message = "The following materials are due today: ";

				foreach( $today as $itemName )
				{
					$message += $itemName . " ";
				}

				$message += "\n";

				$message += "Please return materials to the Instructional Materials Center before 4:00.  Thank you.\n";

				$message += "Brenda Cusanelli, Chief Clerk\n";

				$message += "Instructional Materials Center - SIUE\n";

				$message += "Founders Hall 1208\n";

				$message += "618-650-3494\n";

				$message += "bcusane@siue.edu";

				mail( $row['checkedOutUserEmail'], $subject, $message, $headers );
			}

			if( sizeof( $late ) > 0 )
			{
				$subject = "Reminder from IMC";

				$message = "The following materials are past due: ";

				foreach( $late as $itemName )
				{
					$message += $itemName . " ";
				}

				$message += "\n";

				$message += "To ensure future checkout privileges, please return materials to the Instructional Materials Center between 8am – 4pm.  Contact the IMC Clerk if you have any questions or concerns.  Thank you.";

				$message += "Brenda Cusanelli, Chief Clerk\n";

				$message += "Instructional Materials Center - SIUE\n";

				$message += "Founders Hall 1208\n";

				$message += "618-650-3494\n";

				$message += "bcusane@siue.edu";

				mail( $row['checkedOutUserEmail'], $subject, $message, $headers );
			}			
		}
	}
?>