<?php
  require "data/dataHelper.php";
  $conn = connectToDatabase();
  $postData = file_get_contents("php://input");
  $data = json_decode($postData);
  $name = $data->name;
  $bandId = $data->bandId;
  $userId =$data->userId;
  $description = $data->description;
  date_default_timezone_set('CST6CDT');
  if(mysqli_ping($conn)) {
    // If band id was found, Insert the song
    if ($bandId != "") {
      $query = "INSERT INTO Songs (name, description, lyrics, bandId, userId, creationDate)
                VALUES ('" . $name . "','" . $description . "','" . $lyrics . "','" . $bandId . "','" . $userId . "', NOW());";
      if ($result = mysqli_query($conn, $query)) {
        echo "New record created successfully!";
      } else {
        echo "Sorry, the song was not added.";
        echo $query;
      }
    } else {
      echo "Sorry, band was not found.";
    }
  }

  mysqli_close($conn);
?>
