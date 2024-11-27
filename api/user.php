<?php

require_once "header.php";

class HugotUser{
    function registerUser($json) {
        
        include "connection.php";

        $decoded_json = json_decode($json, true);
    
            $userFname =  htmlspecialchars($decoded_json["firstName"]);
            $userLname = htmlspecialchars($decoded_json["lastName"]);
            $username = htmlspecialchars($decoded_json["username"]);
            $email = htmlspecialchars($decoded_json["email"]);
            $userPword = $decoded_json["password"];
            $hashedPassword = password_hash($userPword, PASSWORD_DEFAULT);
    
            $sqlCheckUsername = "SELECT username FROM users WHERE username = :username";
            $stmtCheckUsername = $conn->prepare($sqlCheckUsername);
            $stmtCheckUsername->bindParam(":username", $username);
            $stmtCheckUsername->execute();
    
            if ($stmtCheckUsername->rowCount() > 0) {
                return json_encode(array("status" => "failed", "message" => "Username already exist. Please try another."));
            }
            
            $sqlCheckEmail = "SELECT email FROM users WHERE email = :email";
            $stmtCheckEmail = $conn->prepare($sqlCheckEmail);
            $stmtCheckEmail->bindParam(":email", $email);
            $stmtCheckEmail->execute();
    
            if ($stmtCheckEmail->rowCount() > 0) {
                return json_encode(array("status" => "failed", "message" => "Email already exist. Please try another."));

            } 

            $sqlInsertUser = "INSERT INTO users(first_name, last_name, username, email, password_hash, created_at) ";
            $sqlInsertUser .= "VALUES(:userFname, :userLname, :username, :email,  :userPass, CURRENT_TIMESTAMP())";

            $stmtInsertUser = $conn->prepare($sqlInsertUser);
            $stmtInsertUser->bindParam(":userFname", $userFname);
            $stmtInsertUser->bindParam(":userLname", $userLname);
            $stmtInsertUser->bindParam(":username", $username);
            $stmtInsertUser->bindParam(":email", $email);
            $stmtInsertUser->bindParam(":userPass", $hashedPassword);
            $stmtInsertUser->execute();

                if ($stmtInsertUser->rowCount() > 0) {
                return json_encode(array("status" => "success", "message" => "Congratulations, your account has been successfully created."));
            } else {
                return json_encode(array("status" => "failed", "message" => "Account registration was unsuccessful."));
            }
    }

    function getUser($json) {
        include "connection.php";

        $decoded_json = json_decode($json, true);
    
        $userId =  $decoded_json["userId"];
            
        $sql = "SELECT user_id, first_name, last_name, username, email, avatar FROM users WHERE user_id = :userId";
        $stmt = $conn->prepare($sql);
        $stmt->bindParam(":userId", $userId);
        $stmt->execute();
        
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);
        
        $conn = null;
        $stmt = null;
        
        echo json_encode($userData);
    }

}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $operation = isset($_GET['operation']) ? $_GET['operation'] : "";
    $json = isset($_GET['json']) ? $_GET['json'] : "";
} else if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $operation = isset($_POST['operation']) ? $_POST['operation'] : "";
    $json = isset($_POST['json']) ? $_POST['json'] : "";
}


$systemUser = new HugotUser();

switch($operation){
    case "registerUser":
        echo $systemUser->registerUser($json);
        break;
    case "getUser":
        echo $systemUser->getUser($json);
        break;
}

?>