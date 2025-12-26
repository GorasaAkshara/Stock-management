<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");

include 'db_connect.php';

$method = $_SERVER['REQUEST_METHOD'];

// Handle OPTIONS request for CORS
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Handle GET request: Fetch all items
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("SELECT * FROM stock_items ORDER BY updated_at DESC");
        $stocks = $stmt->fetchAll();

        // Convert keys to camelCase for React
        $data = array_map(function ($item) {
            return [
                'id' => (string) $item['id'],
                'stockNumber' => $item['stock_number'],
                'productName' => $item['product_name'],
                'quantity' => (int) $item['quantity'],
                'price' => (float) $item['price'],
                'updatedAt' => $item['updated_at']
            ];
        }, $stocks);

        echo json_encode($data);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Handle POST request: Add new item
if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['stockNumber']) || !isset($input['productName'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing required fields']);
        exit();
    }

    try {
        $sql = "INSERT INTO stock_items (stock_number, product_name, quantity, price, updated_at) 
                VALUES (:stockNumber, :productName, :quantity, :price, NOW()) RETURNING id";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':stockNumber' => $input['stockNumber'],
            ':productName' => $input['productName'],
            ':quantity' => $input['quantity'] ?? 0,
            ':price' => $input['price'] ?? 0.00
        ]);

        $result = $stmt->fetch();
        echo json_encode(['status' => 'success', 'id' => $result['id']]);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Handle PUT request: Update item
if ($method === 'PUT') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing item id']);
        exit();
    }

    try {
        $sql = "UPDATE stock_items
                SET stock_number = :stockNumber,
                    product_name = :productName,
                    quantity = :quantity,
                    price = :price,
                    updated_at = NOW()
                WHERE id = :id";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':id' => $input['id'],
            ':stockNumber' => $input['stockNumber'] ?? '',
            ':productName' => $input['productName'] ?? '',
            ':quantity' => $input['quantity'] ?? 0,
            ':price' => $input['price'] ?? 0.00
        ]);

        echo json_encode(['status' => 'success']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}

// Handle DELETE request: Remove item
if ($method === 'DELETE') {
    $input = json_decode(file_get_contents('php://input'), true);

    if (!isset($input['id'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing item id']);
        exit();
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM stock_items WHERE id = :id");
        $stmt->execute([':id' => $input['id']]);
        echo json_encode(['status' => 'success']);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }
}
?>