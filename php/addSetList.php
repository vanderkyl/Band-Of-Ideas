<?php
  require 'data/dataHelper.php';
  $conn = connectToDatabase();

  $postData = file_get_contents("php://input");
  $data = json_decode($postData);
  $setListName = $data->name;
  $bandId = $data->bandId;
  $userId = $data->userId;


  if(mysqli_ping($conn)) {

    $query = "INSERT  SetLists (name, userId, bandId, public)
                VALUES ('" . $setListName . "','" . $userId . "','" . $bandId . "', 'true')";

    if ($result = mysqli_query($conn, $query)) {
      echo "Success!";
    } else {
      echo "Sorry, it didn't work.";
      echo $query;
    }
  }

  mysqli_close($conn);
?>
