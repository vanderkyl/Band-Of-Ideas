<?php
  require 'data/dataHelper.php';
  $conn = connectToDatabase();
//get the q parameter from URL
$searchString=$_GET["q"];
$bandId = $_GET["bandId"];
$files = [];
if(mysqli_ping($conn)) {
  $query = "SELECT * FROM Files WHERE name LIKE '%" . $searchString . "%'";

  if ($result = mysqli_query($conn, $query)) {
    $data = "";
    if ($result->num_rows > 0) {
      // Get current row as an array
      while($row = mysqli_fetch_assoc($result)) {
        $folderName = "";
        $folderMeta = "";
        $query = "SELECT name, metaName FROM Folders WHERE id = '" . $row["folderId"] . "'";
        if ($folderResult = mysqli_query($conn, $query)) {
          $data = "";
          if ($folderResult->num_rows > 0) {
            // Get current row as an array
            if ($folderRow = mysqli_fetch_assoc($folderResult)) {
              $folderName = $folderRow["name"];
              $folderMeta = $folderRow["metaName"];
            }
          }
        }
        $bandName = "";
        $bandMeta = "";
        $query = "SELECT name, metaName FROM Bands WHERE id = '" . $row["bandId"] . "'";
        if ($bandResult = mysqli_query($conn, $query)) {
          $data = "";
          if ($bandResult->num_rows > 0) {
            // Get current row as an array
            if ($bandRow = mysqli_fetch_assoc($bandResult)) {
              $bandName = $bandRow["name"];
              $bandMeta = $bandRow["metaName"];
            }
          }
        }
        $data = ['id' => $row["id"],
                 'name' => getFriendlyTitle($row["name"]),
                 'bandName' => $bandName,
                 'bandMeta' => $bandMeta,
                 'folderName' => $folderName,
                 'folderMeta' => $folderMeta
                 ];
        $files[] = $data;
      }
    }
    echo json_encode($files);
  }
} else {
  echo "Error: " . msqli_error($conn);
}
?>
