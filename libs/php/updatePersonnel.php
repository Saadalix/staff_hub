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

	$firstName = trim($_POST['firstName'] ?? '');
	$lastName  = trim($_POST['lastName']  ?? '');
	$jobTitle  = trim($_POST['jobTitle']  ?? '');
	$email     = trim($_POST['email']     ?? '');
	$deptID    = (int)($_POST['departmentID'] ?? 0);
	$id        = (int)($_POST['id']          ?? 0);

	if ($deptID === 0) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "validation";
		$output['status']['description'] = "A department is required.";
		$output['data'] = [];
		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}

	// Email uniqueness check — exclude the current record
	$check = $conn->prepare('SELECT id FROM personnel WHERE email = ? AND id != ?');
	$check->bind_param("si", $email, $id);
	$check->execute();
	$check->store_result();

	if ($check->num_rows > 0) {
		$output['status']['code'] = "409";
		$output['status']['name'] = "conflict";
		$output['status']['description'] = "This email is already assigned to another personnel. Please use a different email address.";
		$output['data'] = [];
		$check->close();
		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}
	$check->close();

	$query = $conn->prepare('UPDATE personnel SET firstName = ?, lastName = ?, jobTitle = ?, email = ?, departmentID = ? WHERE id = ?');
	$query->bind_param("ssssii", $firstName, $lastName, $jobTitle, $email, $deptID, $id);

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