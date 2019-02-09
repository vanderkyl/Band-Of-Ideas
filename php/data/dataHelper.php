<?php
  // DB creds and connection variable
  $sqlUser = "kylevanderhoof";
  $sqlPW = "ashdrum10";
  $sqlDB = "IdeaBand";

  function connectToDatabase() {
    $conn = mysqli_connect("localhost", $GLOBALS['sqlUser'], $GLOBALS['sqlPW'], $GLOBALS['sqlDB']);
    checkForConnectionError($conn);
    return $conn;
  }

  function checkForConnectionError($conn) {
    if($conn->connect_error) {
      echo "Failed to connect." . $conn->connect_error;
    }
  }

  function getPostData() {
    $postData = file_get_contents("php://input");
    return json_decode($postData);
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

  function runMySQLSelectQuery($conn, $query) {
    return mysqli_query($conn, $query);
  }

  function runMySQLInsertQuery($conn, $query) {
    if ($result = mysqli_query($conn, $query)) {
      echo "Successful Insert! -> " . $query . " <-";
    } else {
      echo "Sorry, the Insert was unsuccessful... - " . $query . " <-";
    }
  }

    // Helper Methods //

    function roundToTwoDecimals($num) {
      if (empty($num)) {
        return $num;
      } else {
        return round($num, 2);
      }
    }

    function calculateFileSize($bytes) {
      $kiloByte = 1024;
      $megaByte = 1048576;
      $gigaByte = 1073741824;
      $fileSize = $bytes;
      if ($bytes < $kiloByte) {
        $fileSize += " bytes";
      } else if ($bytes < $megaByte) {
        $fileSize = roundToTwoDecimals($bytes/$kiloByte) . " KB";
      } else if ($bytes < $gigaByte) {
        $fileSize = roundToTwoDecimals($bytes/$megaByte) . " MB";
      } else {
        $fileSize = roundToTwoDecimals($bytes/$gigaByte) . " GB";
      }
      return $fileSize;
    }

    function getFriendlyTitle($title) {
      $fileExtensionStart = strlen($title) - 3;
      $fileExtension = substr($title, $fileExtensionStart);
      if ($fileExtension == "m4a") {
          $title = str_replace('.m4a', '', $title);
      } else if ($fileExtension == "MP4") {
          $title = str_replace('.MP4', '', $title);
      }
      return $title;
    }
    

 ?>
