<?php
  require "data/dataHelper.php";
  $conn = connectToDatabase();
  $postData = file_get_contents("php://input");
  $data = json_decode($postData);
  $name = $data->name;
  $metaName = $data->metaName;
  $band = $data->band;
  $folderId = "";
  $bandId = "";
  $userId =$data->userId;
  $description = "";

  if(mysqli_ping($conn)) {
    // Find band id
    if ($result = mysqli_query($conn, "SELECT id FROM Bands WHERE name='" . $band . "';")) {
      if($row = mysqli_fetch_assoc($result)) {
        $bandId = $row["id"];
      }
    }
    // If band id was found, Insert the folder
    if ($bandId != "") {
      $query = "INSERT INTO Folders (name, metaName, bandId, userId, description, creationDate)
                VALUES ('" . $name . "','" . $metaName . "','" . $bandId . "','" . $userId . "','" . $description . "',NOW());";
      if ($result = mysqli_query($conn, $query)) {
        echo "New record created successfully!";
      } else {
        echo "Sorry, the folder was not added.";
        echo $query;
      }
    } else {
      echo "Sorry, band was not found.";
    }
  }

  mysqli_close($conn);
?>
