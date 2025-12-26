<?php
header("Content-Type: application/json");

include 'db_connect.php';

try {
    $stmt = $pdo->query("SELECT 1 AS test");
    $result = $stmt->fetch();

    echo json_encode([
        "status" => "success",
        "result" => $result
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "status" => "failed",
        "error" => $e->getMessage()
    ]);
}
