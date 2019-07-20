<?php
  header('Content-Type: application/json');
  require 'data/dataHelper.php';

  $conn = connectToDatabase();



  if(mysqli_ping($conn)) {
    $data = [];
    $type = $_GET['type'];
    if ($type == "bandList") {
        $bandIds = json_decode($_GET['bandIds']);
        if (empty($bandIds)) {
                $data = ['comments' => [],
                         'highlights' => []];
            } else {
                $data = ['comments' => getRecentComments($conn, $bandIds),
                         'highlights' => getRecentHighlights($conn, $bandIds)];
            }
    } else if ($type == "activityCount") {
        $bandId = $_GET['bandId'];
        $data = ['band' => getBand($conn, $bandId),
                 'activityCount' => getBandActivityCount($conn, $bandId)];
    }


    echo json_encode($data);
  } else {
    echo "Error: " . msqli_error($conn);
  }

  mysqli_close($conn);

  function getBandActivityCount($conn, $bandId) {
      $query = "SELECT COUNT(id) FROM Comments WHERE bandId = '" . $bandId . "'";

      if ($result = mysqli_query($conn, $query)) {
            $count = 0;
            if ($result->num_rows > 0) {
              // Get current row as an array
              if ($row = mysqli_fetch_assoc($result)) {
                $count = $row["Count(id)"];
              }
            }
            return $count;
          }
  }

  function getRecentComments($conn, $bandIds) {

    $query = "SELECT * FROM Comments WHERE bandId = '" . $bandIds[0] . "'";
    if (count($bandIds) > 1) {
      for($i = 1; $i < count($bandIds); $i++) {
        $query = $query . " OR bandId = '" . $bandIds[$i] . "'";
      }
    }

    if ($result = mysqli_query($conn, $query)) {
      $data = "";
      $comments = [];
      if ($result->num_rows > 0) {
        // Get current row as an array
        while ($row = mysqli_fetch_assoc($result)) {
          $band = getBand($conn, $row["bandId"]);
          $userName = getUserName($conn, $row["userId"]);
          $file = getFile($conn, $row["fileId"]);
          $data = ['id' => $row["id"],
                   'comment' => $row["comment"],
                   'commentTime' => $row["commentTime"],
                   'userName' => $userName,
                   'file' => $file,
                   'band' => $band,
                   'bandName' => $band["name"]];
          $comments[] = $data;

        }
      }
      return $comments;
    }
  }

  function getRecentHighlights($conn, $bandIds) {
    $query = "SELECT * FROM Highlights WHERE bandId = '" . $bandIds[0] . "'";
    if (count($bandIds) > 1) {
      for($i = 1; $i < count($bandIds); $i++) {
        $query = $query . " OR bandId = '" . $bandIds[$i] . "'";
      }
    }

    if ($result = mysqli_query($conn, $query)) {
      $data = "";
      $highlights = [];
      if ($result->num_rows > 0) {
        // Get current row as an array
        while ($row = mysqli_fetch_assoc($result)) {
          $band = getBand($conn, $row["bandId"]);
          $userName = getUserName($conn, $row["userId"]);
          $file = getFile($conn, $row["fileId"]);
          $data = ['id' => $row["id"],
                   'comment' => $row["comment"],
                   'commentTime' => $row["commentTime"],
                   'highlightTime' => roundToTwoDecimals($row["highlightTime"]),
                   'userName' => $userName,
                   'file' => $file,
                   'band' => $band,
                   'bandName' => $band["name"]];
          $highlights[] = $data;

        }
      }
      return $highlights;
    }
  }

  function getUserName($conn, $userId) {
      $userName = "";

      if ($userResult = mysqli_query($conn, "SELECT name FROM Users WHERE id = '" . $userId . "';")) {
        if ($userResult->num_rows > 0) {
          if ($userRow = mysqli_fetch_assoc($userResult)) {
            $userName = $userRow["name"];
          }
        }
      }
      return $userName;
  }

  function getFile($conn, $fileId) {
      $file = [];

      if ($result = mysqli_query($conn, "SELECT * FROM Files WHERE id = '" . $fileId . "';")) {
        if ($result->num_rows > 0) {
          if ($row = mysqli_fetch_assoc($result)) {
            $file = ['id' => $fileId,
                     'name' => getFriendlyTitle($row["name"]),
                     'folder' => getFolder($conn, $row["folderId"])];
          }
        }
      }
      return $file;
  }

  function getFolder($conn, $folderId) {
      $folder = [];

      if ($result = mysqli_query($conn, "SELECT * FROM Folders WHERE id = '" . $folderId . "';")) {
        if ($result->num_rows > 0) {
          if ($row = mysqli_fetch_assoc($result)) {
            $folder = ['id' => $folderId,
                     'name' => $row["name"]];
          }
        }
      }
      return $folder;
  }

  function getBand($conn, $bandId) {
      $band = [];

      if ($result = mysqli_query($conn, "SELECT * FROM Bands WHERE id = '" . $bandId . "';")) {
        if ($result->num_rows > 0) {
          if ($row = mysqli_fetch_assoc($result)) {
            $band = ['id' => $bandId,
                     'name' => $row["name"]];
          }
        }
      }
      return $band;
  }
?>
