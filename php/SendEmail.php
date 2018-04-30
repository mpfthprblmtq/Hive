<?php

	include_once 'ChromePhp.php';

	$data = file_get_contents("php://input");
	$data = json_decode( $data, true );

	$name = $data['name'];
	$email = $data['email'];
	$subject = $data['subject'];
	$message = $name . "," . "\r\n" . $data['message'] . "\r\n" . "Regards," . "\r\n" . "HIVE";

	ChromePhp::log($name);
	ChromePhp::log($email);
	ChromePhp::log($subject);
	ChromePhp::log($message);

	$headers = 'From: HIVE <hive@isg.siue.edu>' . "\r\n" .
		'Reply-To: donotreply@hive.isg.siue.edu' . "\r\n" .
		'X-Mailer: PHP/' . phpversion();

	mail($email, $subject, $message, $headers);

?>
