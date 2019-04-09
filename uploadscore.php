<?php

$user = $_REQUEST["user"];
$score = $_REQUEST["score"];

class MyDB extends SQLite3
{
    public function __construct()
    {
        $this->open('scoreboard.db');
    }
}

$db = new MyDB();
if (!$db) {
    echo $db->lastErrorMsg();
} else {
    $sql = "INSERT INTO `highscores`(`gamertag`, `score`) VALUES ('" . $user . "'," . $score . ")";

    $ret = $db->query($sql);
    if(!$ret) {
        echo $db->lastErrorMsg();
    } else {
        echo " Record created successfully";
    }
    $db->close();
}

/*$user = $_REQUEST["user"];
$score = $_REQUEST["score"];

$servername = "localhost";
$username = "scoreuploadndownload";
$password = "Alligator3";
$dbname = "leaderboard";

$conn = new mysqli($servername, $username, $password, $dbname);

if(!$conn){
die(" Connection Failed: " . mysqli_connect_error());
}
mysqli_select_db($conn,"highscores");
$sql= "INSERT INTO `highscores`(`gamertag`, `score`) VALUES ('" . $user . "'," . $score . ")";
if (mysqli_query($conn, $sql)) {
echo " New record created successfully";
} else {
echo "Error: " . $sql . "<br>" . mysqli_error($conn);
}

mysqli_close($conn);*/
