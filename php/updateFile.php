<?php
  require 'data/dataHelper.php';
  $conn = connectToDatabase();
  $data = getPostData();
  $id = $data->id;
  date_default_timezone_set('CST6CDT');
  $dateTime = date('F jS Y \- h:i A');

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
      $bandId = $data->bandId;
      $user= $_GET['user'];
      $userId = "";
      // Find user id
      if ($result = mysqli_query($conn, "SELECT id FROM Users WHERE email='" . $user . "';")) {
        if($row = mysqli_fetch_assoc($result)) {
          $userId = $row["id"];
        }
      }
      $query = "INSERT INTO UserViews (userId, fileId, bandId) VALUES ('" . $userId . "', '" . $id . "', '" . $bandId . "', NOW());";
      if ($result = mysqli_query($conn, $query)) {
        echo "UserView inserted successfully";
      } else {
        echo "Insert unsuccessful";
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

      $bandId = $data->bandId;
      $query = "INSERT INTO UserLikes (userId, fileId, bandId, likeDate) VALUES ('" . $userId . "', '" . $id . "', '" . $bandId . "', NOW());";
      if ($result = mysqli_query($conn, $query)) {
        echo "UserLike inserted successfully";
      } else {
        echo "Insert unsuccessful";
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
