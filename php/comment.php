<?php
  include 'data/dataHelper.php';
  $conn = connectToDatabase();
  // Retrieve Post data
  $postData = file_get_contents("php://input");
  $data = json_decode($postData);
  $comment = $data->comment;
  $userId = $data->userId;
  $fileId = $data->fileId;
  $bandId = $data->bandId;

  date_default_timezone_set('CST6CDT');
  $dateTime = date('F jS Y \- h:i A');

  checkForConnectionError($conn);

  if(mysqli_ping($conn)) {
    if ($userId != "" && $fileId != "" && $bandId != "") {
      $query = "INSERT INTO Comments (comment, userId, fileId, bandId, commentTime)
                VALUES ('" . $comment . "','" . $userId . "','" . $fileId . "','" . $bandId . "','" . $dateTime . "');";
      runMySQLInsertQuery($conn, $query);
    } else {
      echo "Sorry, the comment failed to upload.";
    }
  }

  mysqli_close($conn);
?>
