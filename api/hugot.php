<?php

require_once "header.php";

class Hugot{

    function addHugot($json) {
        
        include "connection.php";

        $decoded_json = json_decode($json, true);

        try {
    
            $hugotLine =  htmlspecialchars($decoded_json["hugotLine"]);
            $userId = $decoded_json["userId"];
            $status = 1;

            $sqlInsertHugot = "INSERT INTO hugots(user_id, content, status, created_at) ";
            $sqlInsertHugot .= "VALUES(:userId, :hugotLine, :status, CURRENT_TIMESTAMP())";

            $stmtInsertHugot = $conn->prepare($sqlInsertHugot);
            $stmtInsertHugot->bindParam(":userId", $userId);
            $stmtInsertHugot->bindParam(":hugotLine", $hugotLine);
            $stmtInsertHugot->bindParam(":status", $status);
            $stmtInsertHugot->execute();

            if ($stmtInsertHugot->rowCount() > 0) {

                return json_encode(array("status" => "success", "message" => "Your hugot has been successfully posted."));
            } else {
                return json_encode(array("status" => "failed", "message" => "We're unable to post your hugot"));
            }
        } catch (PDOException $e) {
            return json_encode(array("status" => "failed", "message" => "An unexpected error occured. Please try again." , "error" => $e->getMessage()));
        } 
    }

    function getHugot() {
        include "connection.php";

        try {
        
            $sql = "SELECT u.username, u.email, u.avatar, hp.hugot_id, hp.user_id, hp.content AS hugot_content, hp.created_at, ";
            $sql .= "COALESCE(COUNT(DISTINCT l.like_id),0) AS heart_count, COALESCE(COUNT(DISTINCT f.favorite_id),0) AS bookmark_count, COALESCE(AVG(r.rating),0) AS average_rating FROM hugots hp ";
            $sql .= "LEFT JOIN users u ON hp.user_id = u.user_id ";
            $sql .= "LEFT JOIN likes l ON hp.hugot_id = l.hugot_id ";
            $sql .= "LEFT JOIN favorites f ON hp.hugot_id = f.hugot_id ";
            $sql .= "LEFT JOIN ratings r ON hp.hugot_id = r.hugot_id ";
            $sql .= "WHERE hp.status = 1 ";
            $sql .= "GROUP BY hp.hugot_id ";
            $sql .= "ORDER BY hp.created_at DESC ";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            
            $hugotData = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $conn = null;
            $stmt = null;
            
            echo json_encode($hugotData);

        } catch (PDOException $e) {
            return json_encode(array("status" => "failed", "message" => "An unexpected error occured. Please try again." , "error" => $e->getMessage()));
        } 
    }

    function getSelectedHugot($json) {
        include "connection.php";

        $decoded_json = json_decode($json, true);

        $hugotId = $decoded_json["hugotId"];

        try {
        
            $sql = "SELECT u.username, u.email, u.avatar, hp.hugot_id, hp.user_id, hp.content AS hugot_content, hp.created_at, ";
            $sql .= "COALESCE(COUNT(DISTINCT l.like_id),0) AS heart_count, COALESCE(COUNT(DISTINCT f.favorite_id),0) AS bookmark_count, COALESCE(AVG(r.rating),0) AS average_rating FROM hugots hp ";
            $sql .= "LEFT JOIN users u ON hp.user_id = u.user_id ";
            $sql .= "LEFT JOIN likes l ON hp.hugot_id = l.hugot_id ";
            $sql .= "LEFT JOIN favorites f ON hp.hugot_id = f.hugot_id ";
            $sql .= "LEFT JOIN ratings r ON hp.hugot_id = r.hugot_id ";
            $sql .= "WHERE hp.hugot_id = :hugotId ";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":hugotId", $hugotId);
            $stmt->execute();
            
            $hugotData = $stmt->fetch(PDO::FETCH_ASSOC);
            
            $conn = null;
            $stmt = null;
            
            echo json_encode($hugotData);

        } catch (PDOException $e) {
            return json_encode(array("status" => "failed", "message" => "An unexpected error occured. Please try again." , "error" => $e->getMessage()));
        } 
    }

    function getHugotComments($json) {
        include "connection.php";

        $decoded_json = json_decode($json, true);

        $hugotId = $decoded_json["hugotId"];

        try {
        
            $sql = "SELECT u.username, u.avatar, c.comment_id, c.content AS hugot_comment, c.created_at ";
            $sql .= "FROM comments c ";
            $sql .= "INNER JOIN users u ON c.user_id = u.user_id ";
            $sql .= "WHERE c.hugot_id = :hugotId ";
            $sql .= "ORDER BY c.created_at DESC"; 
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(":hugotId", $hugotId, PDO::PARAM_INT);
            $stmt->execute();
            
            $hugotComments = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $conn = null;
            $stmt = null;
            
            echo json_encode($hugotComments);

        } catch (PDOException $e) {
            return json_encode(array("status" => "failed", "message" => "An unexpected error occured. Please try again." , "error" => $e->getMessage()));
        } 
    }

    function addComment($json) {
        
        include "connection.php";

        $decoded_json = json_decode($json, true);

        try {
    
            $hugotComment =  htmlspecialchars($decoded_json["hugotComment"]);
            $hugotId = $decoded_json["hugotId"];
            $userId = $decoded_json["userId"];

            $sqlInsertComment = "INSERT INTO comments(hugot_id, user_id, content, created_at) ";
            $sqlInsertComment .= "VALUES(:hugotId, :userId, :hugotComment, CURRENT_TIMESTAMP())";

            $stmtInsertComment = $conn->prepare($sqlInsertComment);
            $stmtInsertComment->bindParam(":hugotId", $hugotId);
            $stmtInsertComment->bindParam(":userId", $userId);
            $stmtInsertComment->bindParam(":hugotComment", $hugotComment);

            $stmtInsertComment->execute();

            if ($stmtInsertComment->rowCount() > 0) {

                return json_encode(array("status" => "success", "message" => "Your comment has been successfully posted."));
            } else {
                return json_encode(array("status" => "failed", "message" => "We're unable to post your comment"));
            }
        } catch (PDOException $e) {
            return json_encode(array("status" => "failed", "message" => "An unexpected error occured. Please try again." , "error" => $e->getMessage()));
        } 
    }

    function getTopHugots() {
        include "connection.php";

        try {
        
            $sql = "SELECT hp.hugot_id, hp.content AS hugot_content, COALESCE(COUNT(l.like_id), 0) AS heart_count FROM hugots hp ";
            $sql .= "LEFT JOIN likes l ON hp.hugot_id = l.hugot_id WHERE hp.status = 1 AND hp.created_at >= CURDATE() - INTERVAL 7 DAY ";
            $sql .= "GROUP BY hp.hugot_id ORDER BY l.like_id ASC LIMIT 10 ";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            
            $hugotData = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            $conn = null;
            $stmt = null;
            
            echo json_encode($hugotData);

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


$hugot = new Hugot();

switch($operation){
    case "addHugot":
        echo $hugot->addHugot($json);
        break;
    case "getHugot":
        echo $hugot->getHugot();
        break;
    case "getSelectedHugot":
        echo $hugot->getSelectedHugot($json);
        break;
    case "getHugotComments":
        echo $hugot->getHugotComments($json);
        break;
    case "addComment":
        echo $hugot->addComment($json);
        break;
    case "getTopHugots":
        echo $hugot->getTopHugots();
        break;
}

?>