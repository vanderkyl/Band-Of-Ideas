<?php
  header('Content-Type: application/json');
  require 'data/dataHelper.php';

  $conn = connectToDatabase();
  $band = $_GET['bandName'];
  $bandId = "";


  if(mysqli_ping($conn)) {
    // Find band id
    if ($result = mysqli_query($conn, "SELECT id FROM Bands WHERE name='" . $band . "';")) {
      if($row = mysqli_fetch_assoc($result)) {
        $bandId = $row["id"];
      } else {
        echo "Band was not found.";
      }
    }
    $query = "SELECT * FROM Folders WHERE bandId = '" . $bandId . "' AND parentId = '0';";

    if ($result = mysqli_query($conn, $query)) {
      $data = "";
      $folders = [];
      if ($result->num_rows > 0) {
        // Get current row as an array
        while ($row = mysqli_fetch_assoc($result)) {
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
                   'parentId' => $row["parentId"],
                   'numFiles' => $numFiles,
                   'numFavorites' => $numFavorites,
                   'numHighlights' => $numHighlights];
          // Only add the folder if it isn't archived
          if ($row["archived"] == "false") {
            $folders[] = $data;
          }
        }
      }
      echo json_encode($folders);
    }
  } else {
    echo "Error: " . msqli_error($conn);
  }

  mysqli_close($conn);
?>
