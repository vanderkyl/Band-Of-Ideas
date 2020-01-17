<?php
  require 'data/dataHelper.php';
  $conn = connectToDatabase();
  $data = getPostData();
  $id = $data->id;

  $updateType = $_GET['type'];

  if(mysqli_ping($conn)) {

    if ($updateType == "views") {
      $views = $data->views;
      $query = "UPDATE Files SET views='" . $views . "' WHERE id='" . $id . "';";
      if ($result = mysqli_query($conn, $query)) {
        echo "File updated successfully";
      } else {
        echo "Update unsuccessful";
        echo $query;
      }
    } else if ($updateType == "duration") {
     $duration = $data->duration;
     $query = "UPDATE Files SET duration='" . $duration . "' WHERE id='" . $id . "';";
     if ($result = mysqli_query($conn, $query)) {
       echo "File updated successfully";
     } else {
       echo "Update unsuccessful";
       echo $query;
     }
   } else if ($updateType == "likes") {
      $likes = $data->likes;
      $user= $_GET['user'];
      $userId = "";
      // Find user id
      if ($result = mysqli_query($conn, "SELECT id FROM Users WHERE email='" . $user . "';")) {
        if($row = mysqli_fetch_assoc($result)) {
          $userId = $row["id"];
        }
      }


      $query = "INSERT INTO UserLikes (userId, fileId) VALUES ('" . $userId . "', '" . $id . "');";
      if ($result = mysqli_query($conn, $query)) {
        echo "File updated successfully";
      } else {
        echo "Update unsuccessful";
        echo $query;
      }
    } else if ($updateType == "video") {
      $link = $data->source;
      $query = "UPDATE Files SET source='" . $link . "' WHERE id='" . $id . "';";
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
