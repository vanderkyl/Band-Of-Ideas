<?php
  require 'data/dataHelper.php';
  $conn = connectToDatabase();

  $postData = file_get_contents("php://input");
  $data = json_decode($postData);
  $playlistId = $data->playlistId;
  $fileId = $data->fileId;


  if(mysqli_ping($conn)) {
    $id = findIdForNewRow($conn, "PlaylistFiles");

    $query = "INSERT INTO PlaylistFiles (id, playlistId, fileId)
                VALUES ('" . $id . "','" . $playlistId . "','" . $fileId . "')";

    if ($result = mysqli_query($conn, $query)) {
      echo "Success!";
    } else {
      echo "Sorry, it didn't work.";
      echo $query;
    }
  }

  mysqli_close($conn);
?>
