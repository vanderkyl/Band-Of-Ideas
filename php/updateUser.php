<?php
  include 'dataHelper.php';
  $postData = file_get_contents("php://input");
  $data = json_decode($postData);
  $userId = $_GET['userId'];
  $type = $_GET['type'];
  $bandId = "";

  if($conn->connect_error) {
    echo "Failed to connect." . $conn->connect_error;
  }

  if(mysqli_ping($conn)) {
    if ($type == "tokenUpdate") {
      $token = $data;
      echo $userId;
      $query = "UPDATE Users SET token = '" . $token . "' WHERE id = '" . $userId . "';";
      if ($result = mysqli_query($conn, $query)) {
        echo "User update successful!";
      } else {
        echo "Sorry, it didn't work.";
        echo $query;
      }
    } else if ($type == "bandUpdate") {
      $band = $data->metaName;
      // Find band id
      if ($result = mysqli_query($conn, "SELECT id FROM Bands WHERE metaName='" . $band . "'")) {
        if($row = mysqli_fetch_assoc($result)) {
          $bandId = $row["id"];

          $userQuery = "UPDATE Users SET bandIds = CONCAT(bandIds, '," . $bandId . "') WHERE id = '" . $userId . "';";

          $bandQuery = "UPDATE Bands SET memberIds = CONCAT(memberIds, '," . $userId . "') WHERE id = '" . $bandId . "';";

          if ($result = mysqli_query($conn, $userQuery)) {
            echo "User update successful!";
            if ($result = mysqli_query($conn, $bandQuery)) {
              echo "Band update successful!";
            } else {
              echo "Sorry, it didn't work.";
              echo $bandQuery;
            }
          } else {
            echo "Sorry, it didn't work.";
            echo $userQuery;
          }
        }
      } else {
        echo "Could not find band id";
      }
    }
  }


  mysqli_close($conn);
?>
