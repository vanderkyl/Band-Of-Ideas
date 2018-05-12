<?php
  // DB creds and connection variable
  $sqlUser = "kylevanderhoof";
  $sqlPW = "ashdrum10";
  $sqlDB = "IdeaBand";

  function connectToDatabase() {
    return mysqli_connect("localhost", $GLOBALS['sqlUser'], $GLOBALS['sqlPW'], $GLOBALS['sqlDB']);
  }

  function checkForConnectionError($conn) {
    if($conn->connect_error) {
      echo "Failed to connect." . $conn->connect_error;
    }
  }

  // Finds the highest id in table and returns the next.
  function findIdForNewRow($conn, $table) {
    if ($result = mysqli_query($conn, "SELECT MAX(id) AS `maxid` FROM " . $table . ";")) {
      if($row = mysqli_fetch_assoc($result)) {
        return $row["maxid"] + 1;
      } else {
        // If no ideas return 1
        return 1;
      }
    }
  }

  function runMySQLInsertQuery($conn, $query) {
    if ($result = mysqli_query($conn, $query)) {
      echo "Successful Insert! -> " . $query . " <-";
    } else {
      echo "Sorry, the Insert was unsuccessful... - " . $query . " <-";
    }
  }

 ?>
