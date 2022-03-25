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
    } else if ($type == "notifications") {
        $userId = $_GET['userId'];
        $bandIds = json_decode($_GET['bandIds']);
        if (empty($bandIds)) {
          $data = ['notifications' => []];
        } else {
          $data = ['notifications' => getNotifications($conn, $bandId, $userId)];
        }
    }

    echo json_encode($data);
  } else {
    echo "Error: " . msqli_error($conn);
  }

  mysqli_close($conn);

  // Get Band Comment Count with -> $bandId
  function getBandActivityCount($conn, $bandId) {
      $query = "SELECT COUNT(id) FROM Highlights WHERE bandId = '" . $bandId . "'";

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

  // Get Comments with -> $bandIds
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

  // Get Highlights with -> $bandIds
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

  // Get Notifications (Uploads, New Folders, Likes, Comments, Highlights)
  function getNotifications($conn, $bandIds, $userId) {
    $user = getUser($conn, $userId);
    $lastloggedin = $user->lastloggedin;
    $recentUploadActivity = getRecentUploads($conn, $bandIds, $lastloggedin);
    $recentFolderActivity = getRecentFolders($conn, $bandIds, $lastloggedin);
    $uploadActivity = getUploadActivityFromLastThirtyDays($conn, $bandIds);
    $folderActivity = getFolderActivityFromLastThirtyDays($conn, $bandIds);
    $notifications = [
      'recentUploadActivity' => $recentUploadActivity,
      'recentFolderActivity' => $recentFolderActivity,
      'uploadActivity' => $uploadActivity,
      'folderActivity' => $folderActivity
    ];
    return $notifications;
  }

  function getRecentUploads($conn, $bandIds, $lastloggedin) {
    $query = "SELECT * FROM Files WHERE uploadDate >= DATE_ADD('" . $lastloggedin . "', INTERVAL -30 DAY) AND bandId = '" . $bandIds[0] . "'";
    if (count($bandIds) > 1) {
      for($i = 1; $i < count($bandIds); $i++) {
        $query = $query . " OR bandId = '" . $bandIds[$i] . "'";
      }
    }
    $uploads = getUploadActivity($conn, $query);
    return $uploads;
  }

  function getUploadActivityFromLastThirtyDays($conn, $bandIds) {
    $query = "SELECT * FROM Files WHERE uploadDate >= DATE_ADD(NOW(), INTERVAL -30 DAY) AND bandId = '" . $bandIds[0] . "'";
    if (count($bandIds) > 1) {
      for($i = 1; $i < count($bandIds); $i++) {
        $query = $query . " OR bandId = '" . $bandIds[$i] . "'";
      }
    }
    $uploads = getUploadActivity($conn, $query);
    return $uploads;
  }

  function getAllUploadActivity($conn, $bandIds) {
    $query = "SELECT * FROM Files WHERE bandId = '" . $bandIds[0] . "'";
    if (count($bandIds) > 1) {
      for($i = 1; $i < count($bandIds); $i++) {
        $query = $query . " OR bandId = '" . $bandIds[$i] . "'";
      }
    }
    $uploads = getUploadActivity($conn, $query);
    return $uploads;
  }

  // Take in SQL query and get Upload Activity from Files database
  function getUploadActivity($conn, $query) {
    if ($result = mysqli_query($conn, $query)) {
      $data = "";
      $uploads = [];
      if ($result->num_rows > 0) {
        // Get current row as an array
        while ($row = mysqli_fetch_assoc($result)) {
          //$band = getBand($conn, $row["bandId"]);
          //$folder = getFolder($conn, $row["folderId"])
          $userName = getUserName($conn, $row["userId"]);
          $data = ['id' => $row["id"],
                   'name' => getFriendlyTitle($row["name"]),
                   'metaName' => $row["metaName"],
                   'type' => $row["type"],
                   'size' => $row["size"],
                   'link' => $row["link"],
                   'size' => $row["size"],
                   'views' => $row["views"],
                   'duration' => $row["duration"],
                   'uploadTime' => $row["uploadTime"],
                   'userName' => $userName,
                   'folderId' => $row["folderId"],
                   'bandId' => $row["bandId"],
                   'bandName' => $band["name"]];
          $uploads[] = $data;

        }
      }
      return $uploads;
    }
  }

  function getRecentFolders($conn, $bandIds, $lastloggedin) {
    $query = "SELECT * FROM Folders WHERE creationDate >= DATE_ADD('" . $lastloggedin . "', INTERVAL -30 DAY) AND bandId = '" . $bandIds[0] . "'";
    if (count($bandIds) > 1) {
      for($i = 1; $i < count($bandIds); $i++) {
        $query = $query . " OR bandId = '" . $bandIds[$i] . "'";
      }
    }
    $folders = getFolderActivity($conn, $query);
    return $folders;
  }

  function getFolderActivityFromLast30Days($conn, $bandIds) {
    $query = "SELECT * FROM Folders WHERE creationDate >= DATE_ADD(NOW(), INTERVAL -30 DAY) AND bandId = '" . $bandIds[0] . "'";
    if (count($bandIds) > 1) {
      for($i = 1; $i < count($bandIds); $i++) {
        $query = $query . " OR bandId = '" . $bandIds[$i] . "'";
      }
    }
    $folders = getFolderActivity($conn, $query);
    return $folders;
  }

  function getFolderActivity($conn, $query) {
    if ($result = mysqli_query($conn, $query)) {
      $data = "";
      $folders = [];
      if ($result->num_rows > 0) {
        // Get current row as an array
        while ($row = mysqli_fetch_assoc($result)) {
          $userName = getUserName($conn, $row["userId"]);
          $data = ['id' => $row["id"],
                   'name' => $row["name"],
                   'metaName' => $row["metaName"],
                   'bandId' => $row["bandId"],
                   'userName' => $userName,
                   'creationDate' => $row["creationDate"]];
          $folders[] = $data;

        }
      }
      return $folders;
    }
  }

  function getRecentLikes() {

  }

  // Get UserName with -> $userId
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

  // Get File with -> $fileId
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

  // Get Folder with -> $folderId
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

  // Get Band with -> $bandId
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

  function getUser($conn, $id) {
    $user = {};
    if ($result = mysqli_query($conn, "SELECT * FROM Users Where id = " . $id . ";")){
        // Find the new band id
        if($row = mysqli_fetch_assoc($result)) {
          $data = ['id' => $row["id"],
                   'name' => $row["name"],
                   'lastloggedin' => $row["lastloggedin"],
                   'loginDate' => $row["loginDate"]];
          $user = $data;
        }
     }
     return $user;
  }
?>
