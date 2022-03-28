<?php
  header('Content-Type: application/json');
  require 'data/dataHelper.php';
  date_default_timezone_set('CST6CDT');
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
          $data = ['notifications' => getNotifications($conn, $bandIds, $userId)];
        }
    } else if ($type == "recentNotifications") {
        $userId = $_GET['userId'];
        $bandIds = json_decode($_GET['bandIds']);
        if (empty($bandIds)) {
          $data = ['notifications' => []];
        } else {
          $data = ['notifications' => getRecentNotifications($conn, $bandIds, $userId)];
        }
    } else if ($type == "views") {
        $userId = $_GET['userId'];
        $bandIds = json_decode($_GET['bandIds']);
        if (empty($bandIds)) {
          $data = ['views' => []];
        } else {
          $data = ['views' => getRecentViews($conn, $bandIds, $userId)];
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

  function getRecentCommentActivity($conn, $bandIds, $lastloggedin) {
    $query = "SELECT * FROM Highlights WHERE (bandId = '" . $bandIds[0] . "'";
    if (count($bandIds) > 1) {
      for($i = 1; $i < count($bandIds); $i++) {
        $query = $query . " OR bandId = '" . $bandIds[$i] . "'";
      }
    }
    $query = $query . ") AND commentTime BETWEEN '" . $lastloggedin . "' AND NOW()";

    return getCommentActivity($conn, $bandIds, $query);
  }

  function getCommentActivityFromLastThirtyDays($conn, $bandIds, $lastloggedin) {
    $query = "SELECT * FROM Highlights WHERE (bandId = '" . $bandIds[0] . "'";
    if (count($bandIds) > 1) {
      for($i = 1; $i < count($bandIds); $i++) {
        $query = $query . " OR bandId = '" . $bandIds[$i] . "'";
      }
    }
    $query = $query . ") AND commentTime BETWEEN DATE_ADD('" . $lastloggedin . "', INTERVAL -30 DAY) AND '" . $lastloggedin . "'";

    return getCommentActivity($conn, $bandIds, $query);
  }

  function getCommentActivity($conn, $bandIds, $query) {
    if ($result = mysqli_query($conn, $query)) {
      $data = "";
      $highlights = [];
      if ($result->num_rows > 0) {
        // Get current row as an array
        while ($row = mysqli_fetch_assoc($result)) {
          //$band = getBand($conn, $row["bandId"]);
          $userName = getUserName($conn, $row["userId"]);
          $data = ['notificationType' => "comment",
                   'id' => $row["id"],
                   'comment' => $row["comment"],
                   'commentTime' => $row["commentTime"],
                   'commentDate' => $row["commentDate"],
                   'dateTime' => $row["commentDate"],
                   'highlightTime' => roundToTwoDecimals($row["highlightTime"]),
                   'userId' => $row["userId"],
                   "userName" => $userName,
                   'fileId' => $row["fileId"],
                   'bandId' => $row["bandId"]];
          $highlights[] = $data;

        }
      }
      return $highlights;
    }
  }

  // Get Notifications (Uploads, New Folders, Likes, Comments, Highlights)
  function getNotifications($conn, $bandIds, $userId) {
    $user = getUser($conn, $userId);
    $user = (object)$user;
    $lastloggedin = $user->lastloggedin;
    $recentUploadActivity = getRecentUploads($conn, $bandIds, $lastloggedin);
    $recentFolderActivity = getRecentFolders($conn, $bandIds, $lastloggedin);
    $recentCommentActivity = getRecentCommentActivity($conn, $bandIds, $lastloggedin);
    $recentLikeActivity = getRecentLikeActivity($conn, $bandIds, $lastloggedin);
    $uploadActivity = getUploadActivityFromLastThirtyDays($conn, $bandIds, $lastloggedin);
    $folderActivity = getFolderActivityFromLastThirtyDays($conn, $bandIds, $lastloggedin);
    $commentActivity = getCommentActivityFromLastThirtyDays($conn, $bandIds, $lastloggedin);
    $likeActivity = getLikeActivityFromLastThirtyDays($conn, $bandIds, $lastloggedin);
    $notifications = [
      'recentUploadActivity' => $recentUploadActivity,
      'recentFolderActivity' => $recentFolderActivity,
      'recentCommentActivity' => $recentCommentActivity,
      'recentLikeActivity' => $recentLikeActivity,
      'uploadActivity' => $uploadActivity,
      'folderActivity' => $folderActivity,
      'commentActivity' => $commentActivity,
      'likeActivity' => $likeActivity
    ];
    return $notifications;
  }

  // Get Recent Notifications since last login (Uploads, New Folders, Likes, Comments, Highlights)
  function getRecentNotifications($conn, $bandIds, $userId) {
    $user = getUser($conn, $userId);
    $user = (object)$user;
    $lastloggedin = $user->lastloggedin;
    $recentUploadActivity = getRecentUploads($conn, $bandIds, $lastloggedin);
    $recentFolderActivity = getRecentFolders($conn, $bandIds, $lastloggedin);
    $recentCommentActivity = getRecentCommentActivity($conn, $bandIds, $lastloggedin);
    $recentLikeActivity = getRecentLikeActivity($conn, $bandIds, $lastloggedin);
    $notifications = [
      'recentUploadActivity' => $recentUploadActivity,
      'recentFolderActivity' => $recentFolderActivity,
      'recentCommentActivity' => $recentCommentActivity,
      'recentLikeActivity' => $recentLikeActivity
    ];
    return $notifications;
  }

  // Get Recent Views since
  function getRecentViews($conn, $bandIds, $userId) {
    $user = getUser($conn, $userId);
    $user = (object)$user;
    $lastloggedin = $user->lastloggedin;

    $recentViewActivity = getViewActivityFromLastThirtyDays($conn, $userId, $bandIds, $lastloggedin);
    $views = [
      'recentViewActivity' => $recentViewActivity
    ];
    return $views;
  }

  function getRecentUploads($conn, $bandIds, $lastloggedin) {
    $query = "SELECT * FROM Files WHERE (bandId = '" . $bandIds[0] . "'";
    if (count($bandIds) > 1) {
      for($i = 1; $i < count($bandIds); $i++) {
        $query = $query . " OR bandId = '" . $bandIds[$i] . "'";
      }
    }
    $query = $query . ") AND uploadTime BETWEEN '" . $lastloggedin . "' AND NOW()";

    $uploads = getUploadActivity($conn, $query);
    return $uploads;
  }

  function getUploadActivityFromLastThirtyDays($conn, $bandIds, $lastloggedin) {
    $query = "SELECT * FROM Files WHERE (bandId = '" . $bandIds[0] . "'";
    if (count($bandIds) > 1) {
      for($i = 1; $i < count($bandIds); $i++) {
        $query = $query . " OR bandId = '" . $bandIds[$i] . "'";
      }
    }
    $query = $query . ") AND uploadTime BETWEEN DATE_ADD('" . $lastloggedin . "', INTERVAL -30 DAY) AND '" . $lastloggedin . "'";
    $uploads = getUploadActivity($conn, $query);
    return $uploads;
  }

  function getAllUploadActivity($conn, $bandIds, $lastloggedin) {
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
          $data = ['notificationType' => "upload",
                   'id' => $row["id"],
                   'name' => getFriendlyTitle($row["name"]),
                   'metaName' => $row["metaName"],
                   'type' => $row["type"],
                   'size' => $row["size"],
                   'link' => $row["link"],
                   'size' => $row["size"],
                   'views' => $row["views"],
                   'duration' => $row["duration"],
                   'uploadTime' => $row["uploadTime"],
                   'dateTime' => $row["uploadTime"],
                   'userName' => $userName,
                   'folderId' => $row["folderId"],
                   'bandId' => $row["bandId"]];
          $uploads[] = $data;

        }
      }
      return $uploads;
    }
  }

  function getRecentFolders($conn, $bandIds, $lastloggedin) {
    $query = "SELECT * FROM Folders WHERE (bandId = '" . $bandIds[0] . "'";
    if (count($bandIds) > 1) {
      for($i = 1; $i < count($bandIds); $i++) {
        $query = $query . " OR bandId = '" . $bandIds[$i] . "'";
      }
    }
    $query = $query . ") AND creationDate BETWEEN '" . $lastloggedin . "' AND NOW()";
    $folders = getFolderActivity($conn, $query);
    return $folders;
  }

  function getFolderActivityFromLastThirtyDays($conn, $bandIds, $lastloggedin) {
    $query = "SELECT * FROM Folders WHERE (bandId = '" . $bandIds[0] . "'";
    if (count($bandIds) > 1) {
      for($i = 1; $i < count($bandIds); $i++) {
        $query = $query . " OR bandId = '" . $bandIds[$i] . "'";
      }
    }
    $query = $query . ") AND creationDate BETWEEN DATE_ADD('" . $lastloggedin . "', INTERVAL -30 DAY) AND '" . $lastloggedin . "'";
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
          $data = ['notificationType' => "folder",
                   'id' => $row["id"],
                   'name' => $row["name"],
                   'metaName' => $row["metaName"],
                   'bandId' => $row["bandId"],
                   'userName' => $userName,
                   'creationTime' => $row["creationDate"],
                   'dateTime' => $row["creationDate"]];
          $folders[] = $data;

        }
      }
      return $folders;
    }
  }

  function getRecentViewActivity($conn, $userId, $bandIds, $lastloggedin) {
    $query = "SELECT * FROM UserViews WHERE (bandId = '" . $bandIds[0] . "'";
    if (count($bandIds) > 1) {
      for($i = 1; $i < count($bandIds); $i++) {
        $query = $query . " OR bandId = '" . $bandIds[$i] . "'";
      }
    }
    $query = $query . ") AND userId = '" . $userId . "' AND viewDate BETWEEN '" . $lastloggedin . "' AND NOW()";

    return getViewActivity($conn, $query);
  }

  function getViewActivityFromLastThirtyDays($conn, $userId, $bandIds, $lastloggedin) {
    $query = "SELECT * FROM UserViews WHERE (bandId = '" . $bandIds[0] . "'";
    if (count($bandIds) > 1) {
      for($i = 1; $i < count($bandIds); $i++) {
        $query = $query . " OR bandId = '" . $bandIds[$i] . "'";
      }
    }
    $query = $query . ") AND userId = '" . $userId . "'AND viewDate BETWEEN DATE_ADD(NOW(), INTERVAL -30 DAY) AND NOW()";

    return getViewActivity($conn, $query);
  }

  function getViewActivity($conn, $query) {
    if ($result = mysqli_query($conn, $query)) {
      $data = "";
      $views = [];
      if ($result->num_rows > 0) {
        // Get current row as an array
        while ($row = mysqli_fetch_assoc($result)) {
          $band = getBand($conn, $row["bandId"]);
          $file = getFile($conn, $row["fileId"]);
          $folder = $file["folder"];
          //$userName = getUserName($conn, $row["userId"]);
          $data = ['notificationType' => "likedFile",
                   'id' => $row["id"],
                   'name' => $file["name"],
                   'userId' => $row["userId"],
                   'bandId' => $row["bandId"],
                   'fileId' => $row["fileId"],
                   'file' => $file,
                   'folder' => $folder,
                   'band' => $band,
                   'viewDate' => $row["viewDate"]];
          $views[] = $data;

        }
      }
      return $views;
    }
  }

  function getRecentLikeActivity($conn, $bandIds, $lastloggedin) {
    $query = "SELECT * FROM UserLikes WHERE (bandId = '" . $bandIds[0] . "'";
    if (count($bandIds) > 1) {
      for($i = 1; $i < count($bandIds); $i++) {
        $query = $query . " OR bandId = '" . $bandIds[$i] . "'";
      }
    }
    $query = $query . ") AND likeDate BETWEEN '" . $lastloggedin . "' AND NOW()";

    return getLikeActivity($conn, $query);
  }

  function getLikeActivityFromLastThirtyDays($conn, $bandIds, $lastloggedin) {
    $query = "SELECT * FROM UserLikes WHERE (bandId = '" . $bandIds[0] . "'";
    if (count($bandIds) > 1) {
      for($i = 1; $i < count($bandIds); $i++) {
        $query = $query . " OR bandId = '" . $bandIds[$i] . "'";
      }
    }
    $query = $query . ") AND likeDate BETWEEN DATE_ADD('" . $lastloggedin . "', INTERVAL -30 DAY) AND '" . $lastloggedin . "'";

    return getLikeActivity($conn, $query);
  }

  function getLikeActivity($conn, $query) {
    if ($result = mysqli_query($conn, $query)) {
      $data = "";
      $likes = [];
      if ($result->num_rows > 0) {
        // Get current row as an array
        while ($row = mysqli_fetch_assoc($result)) {
          //$band = getBand($conn, $row["bandId"]);
          $file = getFile($conn, $row["fileId"]);
          $userName = getUserName($conn, $row["userId"]);
          $data = ['notificationType' => "likedFile",
                   'id' => $row["id"],
                   'userId' => $row["userId"],
                   "userName" => $userName,
                   'likeDate' => $row["likeDate"],
                   'dateTime' => $row["likeDate"],
                   'fileId' => $row["fileId"],
                   'file' => $file,
                   'bandId' => $row["bandId"]];
          $likes[] = $data;

        }
      }
      return $likes;
    }
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
    $user = [];
    if ($result = mysqli_query($conn, "SELECT * FROM Users Where id = '" . $id . "';")){
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
