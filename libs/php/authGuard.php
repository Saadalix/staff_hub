<?php
    // authGuard.php — restrict to same-origin AJAX requests only
    if (
        !isset($_SERVER['HTTP_X_REQUESTED_WITH']) ||
        strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) !== 'xmlhttprequest'
    ) {
        http_response_code(403);
        echo json_encode(['status' => ['code' => '403', 'description' => 'Forbidden']]);
        exit;
    }
?>