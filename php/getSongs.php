<?php
  header('Content-Type: application/json');
  require 'data/dataHelper.php';

  $conn = connectToDatabase();
  $id = "";
  $bandId = "";
  $data = "";

  if(mysqli_ping($conn)) {
    $type = $_GET['type'];
    if ($type == 'song') {
      $id = $_GET['id'];
      $data = getSong($conn, $id);
    } else if ($type = "songs") {
      $bandId = $_GET['bandId'];
      $data = getSongs($conn, $bandId);
    }
    echo json_encode($data);
  } else {
    echo "Error: " . msqli_error($conn);
  }

  mysqli_close($conn);

  function getSongData($conn, $row) {
    $data = ['id' => $row["id"],
             'name' => $row["name"],
             'description' => $row["description"],
             'bandId' => $row["bandId"],
             'userId' => $row["userId"],
             'lyrics' => $row["lyrics"],
             'creationDate' => $row["creationDate"]];
    return $data;
  }

  // Get Song with -> $id
  function getSong($conn, $id) {
    $query = "SELECT * FROM Songs WHERE id = '" . $id . "';";
    $data = [];
    if ($result = mysqli_query($conn, $query)) {

      if ($result->num_rows > 0) {
        // Get current row as an array
        if ($row = mysqli_fetch_assoc($result)) {
          $data = getSongData($conn, $row);
        }
      }
    }
    return $data;
  }

  // Get Songs with - > $bandId
  function getSongs($conn, $bandId) {
    $query = "SELECT * FROM Songs WHERE bandId = '" . $bandId . "';";
    $songs = [];
    if ($result = mysqli_query($conn, $query)) {
      $data = "";

      if ($result->num_rows > 0) {
        // Get current row as an array
        while ($row = mysqli_fetch_assoc($result)) {
          $data = getSongData($conn, $row);
          $songs[] = $data;
        }
      }
    }
    return $songs;
  }
?>
