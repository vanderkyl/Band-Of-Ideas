<?php
  header('Content-Type: application/json');
  $sqlUser = "kylevanderhoof";
  $sqlPW = "ashdrum10";
  $sqlDB = "IdeaBand";
  $conn = mysqli_connect("localhost", $sqlUser, $sqlPW, $sqlDB);
  $folderName = $_GET['folderName'];
  $folderId = "";

  function roundToTwoDecimals($num) {
    return round($num, 2);
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

  if($conn->connect_error) {
    echo "Failed to connect." . $conn->connect_error;
  }

  if(mysqli_ping($conn)) {
    // Find folder id
    if ($result = mysqli_query($conn, "SELECT id FROM Folders WHERE metaName='" . $folderName . "';")) {
      if($row = mysqli_fetch_assoc($result)) {
        $folderId = $row["id"];
      }
    }
    $query = "SELECT * FROM Files WHERE folderId = '" . $folderId . "'";

    if ($result = mysqli_query($conn, $query)) {
      $data = "";
      $files = [];
      if ($result->num_rows > 0) {
        // Get current row as an array
        while ($row = mysqli_fetch_assoc($result)) {
          $data = ['id' => $row["id"],
                   'name' => $row["name"],
                   'metaName' => $row["metaName"],
                   'type' => $row["type"],
                   'size' => calculateFileSize($row["size"]),
                   'bytes' => intval($row["size"]),
                   'link' => $row["link"],
                   'folderId' => $row["folderId"],
                   'views' => intval($row["views"]),
                   'likes' => intval($row["likes"]),
                   'userLikes' => [$row["userLikes"]]];
          $files[] = $data;
        }
      }
      echo json_encode($files);
    }
  } else {
    echo "Error: " . msqli_error($conn);
  }

  mysqli_close($conn);


?>
