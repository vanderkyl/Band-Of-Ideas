<?php
  header('Content-Type: application/json');
  $sqlUser = "kylevanderhoof";
  $sqlPW = "ashdrum10";
  $sqlDB = "IdeaBand";
  $conn = mysqli_connect("localhost", $sqlUser, $sqlPW, $sqlDB);
  $email = $_GET['email'];
  $data = "";

  if($conn->connect_error) {
    echo "Failed to connect." . $conn->connect_error;
  }

  if(mysqli_ping($conn)) {
    $query = "SELECT * FROM Users WHERE email = '" . $email . "'";

    if ($result = mysqli_query($conn, $query)) {
      if ($row = mysqli_fetch_assoc($result)) {
        $bands = getBands($row["bandIds"], $conn);
        $data = ['id' => $row["id"],
             'name' => $row["name"],
             'email' => $row["email"],
             'password' => $row["password"],
             'bands' => $bands];
      } else {
        $data = new stdClass();
      }
      echo json_encode($data);
    }
  } else {
    echo "Error: " . msqli_error($conn);
  }

  mysqli_close($conn);

  function getBands($bandIds, $conn) {
    $bandArray = explode(',', $bandIds);
    $bands = [];
    foreach ($bandArray as $id) {
      $query = "SELECT * FROM Bands WHERE id = '" . $id . "'";
      if ($result = mysqli_query($conn, $query)) {
        if ($row = mysqli_fetch_assoc($result)) {
          $band = ['id' => $row["id"],
                  'name' => $row["name"],
                  'metaName' => $row["metaName"],
                  'memberIds' => $row["memberIds"],
                  'code' => $row["code"]];
          $bands[] = $band;
        }
      }
    }

    return $bands;
  }
?>
