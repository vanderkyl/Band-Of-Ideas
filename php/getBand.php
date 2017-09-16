<?php
  header('Content-Type: application/json');
  $sqlUser = "kylevanderhoof";
  $sqlPW = "ashdrum10";
  $sqlDB = "IdeaBand";
  $conn = mysqli_connect("localhost", $sqlUser, $sqlPW, $sqlDB);
  $name = $_GET['bandName'];

  if($conn->connect_error) {
    echo "Failed to connect." . $conn->connect_error;
  }

  if(mysqli_ping($conn)) {
    $query = "SELECT * FROM Bands WHERE name = '" . $name . "'";

    if ($result = mysqli_query($conn, $query)) {
      $data = "";
      if ($result->num_rows > 0) {
        // Get current row as an array
        while($row = mysqli_fetch_assoc($result)) {
          $data = ['id' => $row["id"],
                   'name' => $row["name"],
                   'metaName' => $row["metaName"],
                   'memberIds' => explode(',', $row["memberIds"]),
                   'code' => $row["code"]];
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
