<?php

require_once "header.php";

class User {

    function login($json) {
        include "connection.php";

        $decoded_json = json_decode($json, true);
        $username = $decoded_json["username"];
        $password = $decoded_json["password"];
    
        try {
            $sql = "SELECT * FROM users WHERE username = :username ";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":username", $username);
            $stmt->execute();
    
            if ($stmt->rowCount() > 0) {
                $row = $stmt->fetch(PDO::FETCH_ASSOC);
                $hashedPasswordFromDB = $row['password_hash'];
    
                if (password_verify($password, $hashedPasswordFromDB)) {
                    unset($row['password_hash']);
                    return json_encode(array("user" => $row, "status" => "success"));
                } else  {
                    return json_encode(array("status" => "failed", "message" => "Incorrect password."));
                }
            } else {
                return json_encode(array("status" => "failed", "message" => "Incorrect email address."));
            }
        } catch (PDOException $e) {
            return json_encode(array("status" => "failed", "message" => "An unexpected error occured. Please try again." , "error" => $e->getMessage()));
        } 

    }
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $operation = isset($_GET['operation']) ? $_GET['operation'] : "";
    $json = isset($_GET['json']) ? $_GET['json'] : "";
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $operation = isset($_POST['operation']) ? $_POST['operation'] : "";
    $json = isset($_POST['json']) ? $_POST['json'] : "";
}

$user = new User();

switch($operation) {
    case "login":
        echo $user->login($json);
        break;
}
?>
