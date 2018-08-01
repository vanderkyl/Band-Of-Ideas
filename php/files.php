<?php
  header('Content-Type: application/json');
  $sqlUser = "kylevanderhoof";
  $sqlPW = "ashdrum10";
  $sqlDB = "IdeaBand";
  $conn = mysqli_connect("localhost", $sqlUser, $sqlPW, $sqlDB);

  if($conn->connect_error) {
    echo "Failed to connect." . $conn->connect_error;
  }

  if(mysqli_ping($conn)) {
    $requestType = $_GET['type'];
    switch ($requestType) {
      case "getFiles":
        getFiles($conn);
        break;
      default:

    }

  } else {
    echo "Error: " . msqli_error($conn);
  }

  mysqli_close($conn);

  function getFiles($conn) {
    $folderName = $_GET['folderName'];
    $bandId = $_GET['bandId'];
    $folderId = "";
    // Find folder id
    $query = "SELECT id FROM Folders WHERE metaName='" . $folderName . "' AND bandId='" . $bandId . "';";
    if ($result = mysqli_query($conn, $query)) {
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
          // Check if the file has comments
          $comments = [];
          $commentQuery = "SELECT * FROM Comments WHERE fileId = '" . $row["id"] . "'";

          if ($commentResult = mysqli_query($conn, $commentQuery)) {
            if ($commentResult->num_rows > 0) {
              while ($commentRow = mysqli_fetch_assoc($commentResult)) {
                $comment = $commentRow["comment"];
                // Find user name
                $userName = "";
                $userQuery = "SELECT * FROM Users WHERE id = '" . $commentRow["userId"] . "'";
                if ($userResult = mysqli_query($conn, $userQuery)) {
                  if ($userResult->num_rows > 0) {
                    while ($userRow = mysqli_fetch_assoc($userResult)) {
                      $userName = $userRow["name"];
                    }
                  }
                }

                if ($comment != null) {
                  $commentObject = ['id' => $commentRow["id"],
                                    'comment' => $comment,
                                    'userName' => $userName,
                                    'commentTime' => $commentRow["commentTime"]];
                  $comments[] = $commentObject;
                }
              }
            }
          }
          // Check if the file has highlights
          $highlights = [];
          $highlightQuery = "SELECT * FROM Highlights WHERE fileId = '" . $row["id"] . "'";

          if ($highlightResult = mysqli_query($conn, $highlightQuery)) {
            if ($highlightResult->num_rows > 0) {
              while ($highlightRow = mysqli_fetch_assoc($highlightResult)) {
                $highlight = $highlightRow["comment"];
                // Find user name
                $userName = "";
                //echo $highlightRow["highlightTime"];
                $userQuery = "SELECT * FROM Users WHERE id = '" . $highlightRow["userId"] . "'";
                if ($userResult = mysqli_query($conn, $userQuery)) {
                  if ($userResult->num_rows > 0) {
                    while ($userRow = mysqli_fetch_assoc($userResult)) {
                      $userName = $userRow["name"];
                    }
                  }
                }

                if ($highlight != null) {
                  $highlightObject = ['id' => $highlightRow["id"],
                                    'comment' => $highlight,
                                    'userName' => $userName,
                                    'commentTime' => $highlightRow["commentTime"],
                                    'highlightTime' => $highlightRow["highlightTime"]];
                  $highlights[] = $highlightObject;
                }
              }
            }
          }
          // Fill out file data
          $data = ['id' => $row["id"],
                   'name' => getFriendlyTitle($row["name"]),
                   'metaName' => $row["metaName"],
                   'type' => $row["type"],
                   'size' => calculateFileSize($row["size"]),
                   'bytes' => intval($row["size"]),
                   'link' => $row["link"],
                   'source' => $row["source"],
                   'folderId' => $row["folderId"],
                   'views' => intval($row["views"]),
                   'likes' => intval($row["likes"]),
                   'userLikes' => explode(',',$row["userLikes"]),
                   'comments' => $comments,
                   'highlights' => $highlights];
          $files[] = $data;
        }
      }
      echo json_encode($files);
    }
  }

  // Helper Methods
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
  // End of Helper Methods
?>
