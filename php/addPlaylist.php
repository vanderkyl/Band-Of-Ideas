<?php
  require 'data/dataHelper.php';
  $conn = connectToDatabase();

  $postData = file_get_contents("php://input");
  $data = json_decode($postData);
  $setListName = $data->name;
  $bandId = $data->bandId;
  $userId = $data->userId;
  date_default_timezone_set('CST6CDT');
  if(mysqli_ping($conn)) {

    $query = "INSERT INTO Playlists (name, userId, bandId, public, creationDate)
                VALUES ('" . $setListName . "','" . $userId . "','" . $bandId . "', 'true', NOW())";

    if ($result = mysqli_query($conn, $query)) {
      echo "Success!";
    } else {
      echo "Sorry, it didn't work.";
      echo $query;
    }
  }

  mysqli_close($conn);
?>
