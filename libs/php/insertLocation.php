<?php

	include("authGuard.php");

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];
		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}

	$name = trim($_POST['name'] ?? '');

	// Duplicate check — same location name
	$check = $conn->prepare('SELECT id FROM location WHERE name = ?');
	$check->bind_param("s", $name);
	$check->execute();
	$check->store_result();

	if ($check->num_rows > 0) {
		$output['status']['code'] = "409";
		$output['status']['name'] = "duplicate";
		$output['status']['description'] = "A location with this name already exists.";
		$output['data'] = [];
		$check->close();
		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}
	$check->close();

	$query = $conn->prepare('INSERT INTO location (name) VALUES (?)');
	$query->bind_param("s", $name);

	if (!$query->execute()) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";
		$output['data'] = [];
		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];

	mysqli_close($conn);
	echo json_encode($output);

?>