<?php

class MyDB extends SQLite3 {
    function __construct() {
        $this->open('scoreboard.db');
    }
}

$db = new MyDB();
if(!$db) {
    echo $db->lastErrorMsg();
} else {
    $sql = "SELECT `gamertag`, `score` FROM `highscores` ORDER BY `highscores`.`score` DESC LIMIT 5";

    $ret = $db->query($sql);
    while($row = $ret->fetchArray(SQLITE3_ASSOC)) {
        echo $row["gamertag"] . " : " . $row["score"] . "\n";
    }
}

$db->close();


/*$servername = "localhost";
    $username = "scoreuploadndownload";
    $password = "Alligator3";
    $dbname = "leaderboard";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if(!$conn){
        die(" Connection Failed: " . mysqli_connect_error());
    }
    mysqli_select_db($conn,"highscores");
    $sql = "SELECT `gamertag`, `score` FROM `highscores` ORDER BY `highscores`.`score` DESC LIMIT 5";
    $result = mysqli_query($conn, $sql);
    if ($result) {
        while($row = mysqli_fetch_assoc($result)){
            echo $row["gamertag"]. " : " . $row["score"] . "\n";
        }
    } else {
        echo "Error: " . $sql . "<br>" . mysqli_error($conn);
    }

    mysqli_close($conn);*/
    
?>