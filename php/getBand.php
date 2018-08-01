<?php
  header('Content-Type: application/json');
  require 'data/dataHelper.php';
  require 'data/bandMembers.php';
  $conn = connectToDatabase();

  $name = $_GET['bandName'];

  if(mysqli_ping($conn)) {
    $query = "SELECT * FROM Bands WHERE name = '" . $name . "'";

    if ($result = mysqli_query($conn, $query)) {
      $data = "";
      if ($result->num_rows > 0) {
        // Get current row as an array
        while($row = mysqli_fetch_assoc($result)) {
          $bandId = $row["id"];
          $numFiles;
          if ($result = mysqli_query($conn, "SELECT id FROM Files WHERE bandId = '" . $bandId . "'")) {

            $numFiles = $result->num_rows;

          }
          $data = ['id' => $bandId,
               'name' => $row["name"],
               'metaName' => $row["metaName"],
               'memberIds' => explode(',', $row["memberIds"]),
               'members' => getBandMembersByBandId($conn, $bandId),
               'code' => $row["code"],
               'numFiles' => $numFiles];
        }
      } else {
        $data = new stdClass();
      }
      echo json_encode($data);
    }
  } else {
    echo "Error: " . msqli_error($conn);
  }

  mysqli_close($conn);
?>
