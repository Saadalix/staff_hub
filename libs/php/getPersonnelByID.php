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

	$id = (int)($_POST['id'] ?? 0);

	$query = $conn->prepare(
	'SELECT p.id, p.firstName, p.lastName, p.email, p.jobTitle, p.departmentID,
			d.name as department, l.name as location
	FROM personnel p
	LEFT JOIN department d ON d.id = p.departmentID
	LEFT JOIN location l ON l.id = d.locationID
	WHERE p.id = ?'
	);
	$query->bind_param("i", $id);

	if (!$query->execute()) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";
		$output['data'] = [];
		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}

	$result    = $query->get_result();
	$personnel = [];

	while ($row = mysqli_fetch_assoc($result)) {
		array_push($personnel, $row);
	}

	$result = $conn->query('SELECT id, name FROM department ORDER BY name');

	if (!$result) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";
		$output['data'] = [];
		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}

	$department = [];

	while ($row = mysqli_fetch_assoc($result)) {
		array_push($department, $row);
	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data']['personnel']  = $personnel;
	$output['data']['department'] = $department;

	mysqli_close($conn);
	echo json_encode($output);

?>