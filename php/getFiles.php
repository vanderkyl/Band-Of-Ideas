<?php
  header('Content-Type: application/json');
  $sqlUser = "kylevanderhoof";
  $sqlPW = "ashdrum10";
  $sqlDB = "IdeaBand";
  $conn = mysqli_connect("localhost", $sqlUser, $sqlPW, $sqlDB);
  $folderId = $_GET['folderId'];

  if($conn->connect_error) {
    echo "Failed to connect." . $conn->connect_error;
  }

  if(mysqli_ping($conn)) {

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
                   'size' => $row["size"],
                   'link' => $row["link"],
                   'folderId' => $row["folderId"],
                   'views' => $row["views"],
                   'likes' => $row["likes"]];
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
