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

	$name       = trim($_POST['name']       ?? '');
	$locationID = (int)($_POST['locationID'] ?? 0);
	$id         = (int)($_POST['id']         ?? 0);

	if ($locationID === 0) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "validation";
		$output['status']['description'] = "A location is required.";
		$output['data'] = [];
		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}

	// Duplicate check — same name in same location, different record
	$check = $conn->prepare('SELECT id FROM department WHERE name = ? AND locationID = ? AND id != ?');
	$check->bind_param("sii", $name, $locationID, $id);
	$check->execute();
	$check->store_result();

	if ($check->num_rows > 0) {
		$output['status']['code'] = "409";
		$output['status']['name'] = "conflict";
		$output['status']['description'] = "A department with this name already exists in the selected location.";
		$output['data'] = [];
		$check->close();
		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}
	$check->close();

	$query = $conn->prepare('UPDATE department SET name = ?, locationID = ? WHERE id = ?');
	$query->bind_param("sii", $name, $locationID, $id);

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