<?php
  $sqlUser = "kylevanderhoof";
  $sqlPW = "ashdrum10";
  $sqlDB = "IdeaBand";
  $conn = mysqli_connect("localhost", $sqlUser, $sqlPW, $sqlDB);
  $postData = file_get_contents("php://input");
  $data = json_decode($postData);
  $name = $data->name;
  $metaName = $data->metaName;
  $band = $data->band;
  $folderId = "";

  if($conn->connect_error) {
    echo "Failed to connect." . $conn->connect_error;
  }

  if(mysqli_ping($conn)) {
    // Find band id
    if ($result = mysqli_query($conn, "SELECT id FROM Bands WHERE name='" . $band . "';")) {
      if($row = mysqli_fetch_assoc($result)) {
        $bandId = $row["id"];
        echo "bandId " . $bandId;
      } else {
        echo "Band was not found.";
      }
    }

    $query = "INSERT INTO Folders (name, metaName, bandId)
              VALUES ('" . $name . "','" . $metaName . "','" . $bandId . "');";
    if ($result = mysqli_query($conn, $query)) {
      echo "New record created successfully!";
    } else {
      echo "Sorry, the folder was not added.";
      echo $query;
    }
  }

  mysqli_close($conn);
?>
