<?php
  require "data/dataHelper.php";
  $conn = connectToDatabase();
  $postData = file_get_contents("php://input");
  $data = json_decode($postData);
  $name = $data->name;
  $fileId = $data->fileId;
  $bandId = $data->bandId;
  $userId = $data->userId;
  $lyrics = "";
  date_default_timezone_set('CST6CDT');
  if(mysqli_ping($conn)) {
    // If band id was found, Insert the song file
    if ($bandId != "") {
      $query = "INSERT INTO SongFiles (songId, fileId, bandId, userId, addedDate)
                VALUES ('" . $songId . "','" . $fileId . "','" . $bandId . "','" . $userId . "', NOW());";
      if ($result = mysqli_query($conn, $query)) {
        echo "New record created successfully!";
      } else {
        echo "Sorry, the song file was not added.";
        echo $query;
      }
    } else {
      echo "Sorry, band was not found.";
    }
  }

  mysqli_close($conn);
?>
