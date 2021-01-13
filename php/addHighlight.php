 <?php
  include 'data/dataHelper.php';
  $conn = connectToDatabase();
  // Retrieve Post data
  $postData = file_get_contents("php://input");
  $data = json_decode($postData);
  $comment = $data->comment;
  $highlight = $data->highlight;
  $endTime = $data->endTime;
  $userId = $data->userId;
  $fileId = $data->fileId;
  $bandId = $data->bandId;

  date_default_timezone_set('CST6CDT');
  $dateTime = date('F jS Y \- h:i A');

  checkForConnectionError($conn);

  if(mysqli_ping($conn)) {
    if ($userId != "" && $fileId != "" && $bandId != "") {
      $query = "INSERT INTO Highlights (comment, userId, fileId, bandId, commentTime, highlightTime, endTime, commentDate)
                VALUES ('" . $comment . "','" . $userId . "','" . $fileId . "','" . $bandId . "','" . $dateTime . "','" . $highlight . "','" . $endTime ."', NOW());";
      runMySQLInsertQuery($conn, $query);
    } else {
      echo "Sorry, the highlight failed to upload.";
    }
  }

  mysqli_close($conn);
?>
