<?php
  $sqlUser = "kylevanderhoof";
  $sqlPW = "ashdrum10";
  $sqlDB = "IdeaBand";
  $conn = mysqli_connect("localhost", $sqlUser, $sqlPW, $sqlDB);
  $postData = file_get_contents("php://input");
  $data = json_decode($postData);
  $id = $data->id;
  $views = $data->views;
  $likes = $data->likes;
  $updateType = $_GET['type'];;

  if($conn->connect_error) {
    echo "Failed to connect." . $conn->connect_error;
  }

  if(mysqli_ping($conn)) {

    if ($updateType == "views") {
      $query = "UPDATE Files SET views='" . $views . "' WHERE id='" . $id . "';";
      if ($result = mysqli_query($conn, $query)) {
        echo "File updated successfully";
      } else {
        echo "Update unsuccessful";
        echo $query;
      }
    } else if ($updateType == "likes") {
      $query = "UPDATE Files SET likes='" . $likes . "' WHERE id='" . $id . "';";
      if ($result = mysqli_query($conn, $query)) {
        echo "File updated successfully";
      } else {
        echo "Update unsuccessful";
        echo $query;
      }
    } else {
      echo "Update unsuccessful";
    }
  }

  mysqli_close($conn);
?>
