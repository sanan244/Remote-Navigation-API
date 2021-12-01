<?php 
//logtime.php
    $host = "127.0.0.1";
    $username = "root";
    $password = "Awesome224";
    $result_array = array();
    $dbname = "root";
    
    // Create connection
    $conn = new mysqli($host, $username, $password, $dbname);
    
    // Check connection
    if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
    }

    /* SQL query to get results from database */
    $sql = "SELECT * FROM coordinates";
    $result = $conn->query($sql);
    /* If there are results from database push to result array */
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            array_push($result_array, $row);
        }
    }
    /* send a JSON encded array to client */
    header('Access-Control-Allow-Origin: *'); 
    header('Content-type: application/json');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    //echo json_encode($result_array);
    $conn->close();

    /*$pdo=new PDO("mysql:dbname=root;host=127.0.0.1","root","Awesome224");
    $stmt = $pdo->query("SELECT * FROM coordinates");
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($results);
    */
    ?>
    