<?php
  header('Content-Type: application/json');
  require 'data/dataHelper.php';
  require 'data/bandMembers.php';
  $conn = connectToDatabase();

  $name = "";
  $id = "";

  if(mysqli_ping($conn)) {
    if (!empty($_GET['bandName'])) {
        $name = $_GET['bandName'];
        $data = getBands($conn, $name);
    } else if (!empty($_GET['id'])) {
        $id = $_GET['id'];
        $data = getBand($conn, $id);
    }

    echo json_encode($data);
  } else {
    echo "Error: " . msqli_error($conn);
  }

  mysqli_close($conn);

  function getBandData($conn, $row) {
    $bandId = $row["id"];
    $numFiles;
    if ($numFilesResult = mysqli_query($conn, "SELECT id FROM Files WHERE bandId = '" . $bandId . "'")) {

    $numFiles = $numFilesResult->num_rows;

    }
    $data = ['id' => $bandId,
       'name' => $row["name"],
       'metaName' => $row["metaName"],
       'members' => getBandMembersByBandId($conn, $bandId),
       'code' => $row["code"],
       'numFiles' => $numFiles];
    return $data;
  }

  function getBands($conn, $name) {
    $query = "SELECT * FROM Bands WHERE name = '" . $name . "'";
    $data = "";
    if ($result = mysqli_query($conn, $query)) {

        if ($result->num_rows > 0) {
          // Get current row as an array
          while($row = mysqli_fetch_assoc($result)) {
            $data = getBandData($conn, $row);
          }
        } else {
          $data = new stdClass();
        }
        return $data;
    }
  }

  function getBand($conn, $id) {
    $query = "SELECT * FROM Bands WHERE id = '" . $id . "'";
    $data = "";
    if ($result = mysqli_query($conn, $query)) {

      if ($result->num_rows > 0) {
        // Get current row as an array
        if ($row = mysqli_fetch_assoc($result)) {
          $data = getBandData($conn, $row);
        }
      } else {
        $data = new stdClass();
      }
      return $data;
    }
  }
?>
