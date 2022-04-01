<?php
  require 'data/dataHelper.php';
  $conn = connectToDatabase();

  $postData = file_get_contents("php://input");
  $data = json_decode($postData);
  $songId = $data->songId;
  $fileId = $data->fileId;
  $bandId = $data->bandId;
  $userId = $data->userId;

  if(mysqli_ping($conn)) {

    $query = "INSERT INTO SongFiles (songId, fileId, bandId, userId, addedDate)
                VALUES ('" . $id . "','" . $songId . "','" . $fileId . "','" . $bandId  . "','" . $userId . "',NOW())";

    if ($result = mysqli_query($conn, $query)) {
      echo "Success!";
    } else {
      echo "Sorry, it didn't work.";
      echo $query;
    }
  }

  mysqli_close($conn);
?>
