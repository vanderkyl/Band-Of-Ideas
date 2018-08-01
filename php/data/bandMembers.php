<?php
  header('Content-Type: application/json');
  require 'data/users.php';

  function getBandMembersByBandId($conn, $bandId) {
    $query = "SELECT * FROM BandMembers WHERE bandId = '" . $bandId . "'";
    $members = [];
    if ($result = mysqli_query($conn, $query)) {
      if ($result->num_rows > 0) {
        // Get current row as an array
        while($row = mysqli_fetch_assoc($result)) {
          $userId = $row["userId"];
          $members[] = getUserById($conn, $userId);
        }
      }
    }
    return $members;
  }
 ?>
