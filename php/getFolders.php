<?php
  header('Content-Type: application/json');
  $sqlUser = "kylevanderhoof";
  $sqlPW = "ashdrum10";
  $sqlDB = "IdeaBand";
  $conn = mysqli_connect("localhost", $sqlUser, $sqlPW, $sqlDB);
  $band = $_GET['bandName'];
  $bandId = "";

  if($conn->connect_error) {
    echo "Failed to connect." . $conn->connect_error;
  }

  if(mysqli_ping($conn)) {
    // Find band id
    if ($result = mysqli_query($conn, "SELECT id FROM Bands WHERE name='" . $band . "';")) {
      if($row = mysqli_fetch_assoc($result)) {
        $bandId = $row["id"];
      } else {
        echo "Band was not found.";
      }
    }
    $query = "SELECT * FROM Folders WHERE bandId = '" . $bandId . "' AND parentId = '0';";

    if ($result = mysqli_query($conn, $query)) {
      $data = "";
      $folders = [];
      if ($result->num_rows > 0) {
        // Get current row as an array
        while ($row = mysqli_fetch_assoc($result)) {
          $data = ['id' => $row["id"],
                   'name' => $row["name"],
                   'metaName' => $row["metaName"],
                   'bandId' => $row["bandId"],
                   'parentId' => $row["parentId"]];
          $folders[] = $data;
        }
      }
      echo json_encode($folders);
    }
  } else {
    echo "Error: " . msqli_error($conn);
  }

  mysqli_close($conn);
?>
