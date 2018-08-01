<?php
  header('Content-Type: application/json');
  require 'data/dataHelper.php';
  require 'data/bandMembers.php';
  $conn = connectToDatabase();

  $id = $_GET['bandId'];

  if(mysqli_ping($conn)) {
    $query = "SELECT * FROM BandMembers WHERE bandId = '" . $id . "'";

    $data = getBandMembersByBandId($conn, $id);
    echo json_encode($data);

  } else {
    echo "Error: " . msqli_error($conn);
  }

  mysqli_close($conn);
?>
