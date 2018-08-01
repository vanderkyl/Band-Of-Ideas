<?php
  require 'data/dataHelper.php';
  require 'data/bandMembers.php';
  $conn = connectToDatabase();

  $postData = file_get_contents("php://input");
  $data = json_decode($postData);
  $setListName = $data->name;
  $bandId = $data->bandId;
  $userid = $data->userId;


  if(mysqli_ping($conn)) {

    $query = "INSERT INTO SetLists (name, userId, bandId)
                VALUES ('" . $setListName . "','" . $userId . "','" . $bandId . "')";
    echo "Inserting the new set list...";

    if ($result = mysqli_query($conn, $query)) {
      echo "Success!";
    } else {
      echo "Sorry, it didn't work.";
      echo $query;
    }
  }

  mysqli_close($conn);
?>
