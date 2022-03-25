<?php
  header('Content-Type: application/json');
  require 'data/dataHelper.php';

  $conn = connectToDatabase();
  $id = "";
  $band = "";
  $data = "";

  if(mysqli_ping($conn)) {
    if(!empty($_GET['id'])) {
      $id = $_GET['id'];
      $data = getFolder($conn, $id);
    } else if (!empty($_GET['bandName'])) {
      $band = $_GET['bandName'];
      // Find band id
      if ($result = mysqli_query($conn, "SELECT id FROM Bands WHERE name='" . $band . "';")) {
        if($row = mysqli_fetch_assoc($result)) {
          $bandId = $row["id"];
        } else {
          echo "Band was not found.";
        }
      }
      $data = getFolders($conn, $bandId);
    }
    echo json_encode($data);
  } else {
    echo "Error: " . msqli_error($conn);
  }

  mysqli_close($conn);

  function getFolderData($conn, $row) {
    $numFiles;
    $numHighlights;
    $numFavorites;
    if ($fileResult = mysqli_query($conn, "SELECT id FROM Files WHERE folderId = '" . $row["id"] . "';")) {
      $numFiles = $fileResult->num_rows;
      if ($fileResult->num_rows > 0) {

      }
    }
    if ($fileResult = mysqli_query($conn, "SELECT t1.fileId FROM (SELECT fileId FROM UserLikes) t1 INNER JOIN (SELECT id FROM Files WHERE folderId = '" . $row["id"] . "') t2 on t1.fileId = t2.id")) {
      $numFavorites = $fileResult->num_rows;
      if ($fileResult->num_rows > 0) {

      }
    }
    if ($fileResult = mysqli_query($conn, "SELECT t1.fileId FROM (SELECT fileId FROM Highlights) t1 INNER JOIN (SELECT id FROM Files WHERE folderId = '" . $row["id"] . "') t2 on t1.fileId = t2.id")) {
      $numHighlights = $fileResult->num_rows;
      if ($fileResult->num_rows > 0) {

      }
    }
    $data = ['id' => $row["id"],
             'name' => $row["name"],
             'metaName' => $row["metaName"],
             'bandId' => $row["bandId"],
             'userId' => $row["userId"],
             'parentId' => $row["parentId"],
             'numFiles' => $numFiles,
             'numFavorites' => $numFavorites,
             'numHighlights' => $numHighlights];
    return $data;
  }

  // Get Folder with -> $id
  function getFolder($conn, $id) {
    $query = "SELECT * FROM Folders WHERE id = '" . $id . "';";
    $data = [];
    if ($result = mysqli_query($conn, $query)) {

      if ($result->num_rows > 0) {
        // Get current row as an array
        if ($row = mysqli_fetch_assoc($result)) {
          $data = getFolderData($conn, $row);
        }
      }
    }
    return $data;
  }

  // Get Folders with - > $bandId
  function getFolders($conn, $bandId) {
    $query = "SELECT * FROM Folders WHERE bandId = '" . $bandId . "' AND parentId = '0';";
    $folders = [];
    if ($result = mysqli_query($conn, $query)) {
      $data = "";

      if ($result->num_rows > 0) {
        // Get current row as an array
        while ($row = mysqli_fetch_assoc($result)) {
          $data = getFolderData($conn, $row);
          // Only add the folder if it isn't archived
          if ($row["archived"] == "false") {
            $folders[] = $data;
          }
        }
      }
    }
    return $folders;
  }
?>
