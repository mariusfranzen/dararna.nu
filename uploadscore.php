<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>

<?php 
        
        $user = $_REQUEST["user"];
        $score = $_REQUEST["score"];

        $servername = "localhost";
        $username = "root";
        $password = "";
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

        echo "<br>Connected successfully";

        

        mysqli_close($conn);

    ?>
    
</body>
</html>