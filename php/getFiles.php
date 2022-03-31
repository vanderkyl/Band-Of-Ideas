<?php
  header('Content-Type: application/json');
  require 'data/dataHelper.php';

  // Start of Database Connection //

  $conn = connectToDatabase();

  if(mysqli_ping($conn)) {
    $type = $_GET['type'];
    $files = [];
    if ($type == "folder") {
      $folderName = $_GET['folderName'];
      $bandId = $_GET['bandId'];
      $folderId = getFolderId($conn, $bandId, $folderName);
      $files = getFolderFiles($conn, $bandId, $folderId);
    } else if ($type == "allFavorites"){
      $userId = $_GET['userId'];
      $files = getFavoriteFiles($conn, $userId, "");
    } else if ($type == "allHighlights"){
      $userId = $_GET['userId'];
      $files = getHighlightedFiles($conn, $userId, "");
    } else if ($type == "bandFavorites"){
      $userId = $_GET['userId'];
      $bandId = $_GET['bandId'];
      $files = getFavoriteFiles($conn, $userId, $bandId);
    } else if ($type == "bandHighlights"){
      $userId = $_GET['userId'];
      $bandId = $_GET['bandId'];
      $files = getHighlightedFiles($conn, $userId, $bandId);
    } else if ($type == "bandFiles"){
      $bandId = $_GET['bandId'];
      $files = getBandFiles($conn, $bandId);
    } else if ($type == "songFiles"){
      $songId = $_GET['songId'];
      $files = getSongFiles($conn, $songId);
    } else if ($type == "singleFile"){
      $fileId = [$_GET['fileId']];

      $file = getFilesById($conn, $fileId)[0];
      $folderId = $file["folderId"];
      $bandId = $file["bandId"];
      $files = ['file' => $file,
                'folderFiles' => getFolderFiles($conn, $bandId, $folderId),
                'folder' => getFolder($conn, $folderId),
                'band' => getBand($conn, $bandId)];
    } else if ($type == "search") {
      $str = $_GET['str'];
      $files = getSearchResults($conn, $str);
    } else if ($type == "playlist") {
      $playlistId = $_GET['playlistId'];
      $files = getPlaylistFiles($conn, $playlistId);
    }
    echo json_encode($files);
  } else {
    echo "Error: " . msqli_error($conn);
  }

  mysqli_close($conn);

  // End of Database Connection //

  // Start of Helper Methods //

  // Get search results with -> $searchString
  function getSearchResults($conn, $searchString) {
    $files = [];
    if ($result = mysqli_query($conn, "SELECT * FROM Files WHERE name LIKE '%" . $searchString . "%'")) {
      $data = "";
      if ($result->num_rows > 0) {
        // Get current row as an array
        while($row = mysqli_fetch_assoc($result)) {
            $comments = getFileComments($conn, $row);
            $highlights = getFileHighlights($conn, $row);
            $userLikes = getUserLikes($conn, $row["id"]);
            $folder = getFolder($conn, $row["folderId"]);
            $data = ['id' => $row["id"],
                     'name' => getFriendlyTitle($row["name"]),
                     'metaName' => $row["metaName"],
                     'type' => $row["type"],
                     'size' => calculateFileSize($row["size"]),
                     'bytes' => intval($row["size"]),
                     'link' => $row["link"],
                     'source' => $row["source"],
                     'folderId' => $row["folderId"],
                     'folder' => $folder,
                     'bandId' => $row["bandId"],
                     'views' => intval($row["views"]),
                     'likes' => count($userLikes),
                     'userLikes' => $userLikes,
                     'comments' => $comments,
                     'highlights' => $highlights];
            $files[] = $data;
        }
      }
    }
    return $files;
  }

  // Get Folder from DB with -> $folderId
  function getFolder($conn, $folderId) {
      $folder = [];

      if ($result = mysqli_query($conn, "SELECT * FROM Folders WHERE id = '" . $folderId . "';")) {
        if ($result->num_rows > 0) {
          if ($row = mysqli_fetch_assoc($result)) {
            $folder = ['id' => $folderId,
                       'name' => $row["name"],
                       'metaName' => $row["metaName"]];
          }
        }
      }
      return $folder;
  }

  // Get Band from DB with -> bandId
  function getBand($conn, $bandId) {
      $band = [];

      if ($result = mysqli_query($conn, "SELECT * FROM Bands WHERE id = '" . $bandId . "';")) {
        if ($result->num_rows > 0) {
          if ($row = mysqli_fetch_assoc($result)) {
            $band = ['id' => $bandId,
                     'name' => $row["name"],
                     'metaName' => $row["metaName"]];
          }
        }
      }
      return $band;
  }

  // Get Folder Id with -> $bandId and $folderName
  function getFolderId($conn, $bandId, $folderName) {
    $folderId = "";
    // Find folder id
    $query = "SELECT id FROM Folders WHERE metaName='" . $folderName . "' AND bandId='" . $bandId . "';";
    if ($result = mysqli_query($conn, $query)) {
      if($row = mysqli_fetch_assoc($result)) {
        $folderId = $row["id"];
      }
    }
    return $folderId;
  }

  // Get Favorite Files with -> $userId and $bandId
  function getFavoriteFiles($conn, $userId, $bandId) {
    $fileIds = getUserLikedFileIds($conn, $userId, $bandId);
    return getFilesById($conn, $fileIds);
  }

  // Get Highlighted Files with -> $userId and $bandId
  function getHighlightedFiles($conn, $userId, $bandId) {
    $fileIds = getUserHighlightedFileIds($conn, $userId, $bandId);
    return getFilesById($conn, $fileIds);
  }

  // Get Band Files with -> $bandId
  function getBandFiles($conn, $bandId) {
      $fileIds = getBandFileIds($conn, $bandId);
      return getFilesById($conn, $fileIds);
  }

  // Get Band Files with -> $songId
  function getSongFiles($conn, $songId) {
      $fileIds = getSongFileIds($conn, $songId);
      return getFilesById($conn, $fileIds);
  }

  // Get Playlist Files with -> $bandId
  function getPlaylistFiles($conn, $playlistId) {
    $fileIds = getPlaylistFileIds($conn, $playlistId);
    return getFilesById($conn, $fileIds);
  }

  // Get list of Files with -> $fileIds
  function getFilesById($conn, $fileIds) {
    if (empty($fileIds)) {
      return $fileIds;
    } else {
      $whereString = "WHERE id='" . $fileIds[0] . "'";
      for ($i = 1; $i < count($fileIds); $i++) {
        $whereString = $whereString . " OR id='" . $fileIds[$i] . "'";
      }
      $whereString = $whereString . ";";
      // Find the files in the given folder
      $query = "SELECT * FROM Files " . $whereString;
      $files = [];
      if ($result = mysqli_query($conn, $query)) {
        $fileData = "";
        if ($result->num_rows > 0) {
          // Get current row as an array
          while ($row = mysqli_fetch_assoc($result)) {
            $comments = getFileComments($conn, $row);
            $highlights = getFileHighlights($conn, $row);
            $userLikes = getUserLikes($conn, $row["id"]);
            $folder = getFolder($conn, $row["folderId"]);
            $band = getBand($conn, $row["bandId"]);
            // Fill out file data
            $fileData = ['id' => $row["id"],
                     'name' => getFriendlyTitle($row["name"]),
                     'metaName' => $row["metaName"],
                     'type' => $row["type"],
                     'size' => calculateFileSize($row["size"]),
                     'bytes' => intval($row["size"]),
                     'link' => $row["link"],
                     'source' => $row["source"],
                     'folderId' => $row["folderId"],
                     'folder' => $folder,
                     'bandId' => $row["bandId"],
                     'band' => $band,
                     'views' => intval($row["views"]),
                     'likes' => count($userLikes),
                     'userLikes' => $userLikes,
                     'comments' => $comments,
                     'highlights' => $highlights,
                     'duration' => $row["duration"]];
            $files[] = $fileData;
          }
        }
      }
      return $files;
    }
  }

  // Get Folder files with -> $bandId and $folderId
  function getFolderFiles($conn, $bandId, $folderId) {
    // Find the files in the given folder
    $query = "SELECT * FROM Files WHERE folderId = '" . $folderId . "'";
    $files = [];
    if ($result = mysqli_query($conn, $query)) {
      $fileData = "";
      if ($result->num_rows > 0) {

        // Get current row as an array
        while ($row = mysqli_fetch_assoc($result)) {
          $comments = getFileComments($conn, $row);
          $highlights = getFileHighlights($conn, $row);
          $userLikes = getUserLikes($conn, $row["id"]);
          $folder = getFolder($conn, $row["folderId"]);
          // Fill out file data
          $fileData = ['id' => $row["id"],
                   'name' => getFriendlyTitle($row["name"]),
                   'metaName' => $row["metaName"],
                   'type' => $row["type"],
                   'size' => calculateFileSize($row["size"]),
                   'bytes' => intval($row["size"]),
                   'link' => $row["link"],
                   'source' => $row["source"],
                   'folderId' => $row["folderId"],
                   'folder' => $folder,
                   'views' => intval($row["views"]),
                   'likes' => count($userLikes),
                   'userLikes' => $userLikes,
                   'comments' => $comments,
                   'highlights' => $highlights,
                   'duration' => $row["duration"]];
          $files[] = $fileData;
        }
      }
    }
    return $files;
  }

  // Get users who liked file with -> $fileId
  function getUserLikes($conn, $fileId) {
    $userLikes = [];
    $query = "SELECT userId FROM UserLikes WHERE fileId='" . $fileId . "';";
    if ($result = mysqli_query($conn, $query)) {
      if ($result->num_rows > 0) {
        // Get current row as an array
        while ($row = mysqli_fetch_assoc($result)) {
          $userId = $row["userId"];
          $userName = findUserName($conn, $userId);
          $userLikes[] = ['id' => $userId,
                          'name' => $userName];
        }
      }
    }
    return $userLikes;
  }

  // Get User liked File Ids with -> $userId and $bandId
  function getUserLikedFileIds($conn, $userId, $bandId) {
    $fileIds = [];
    $query;
    if ($bandId == "") {
      $query = "SELECT fileId FROM UserLikes WHERE userId='" . $userId . "';";
    } else {
      $query = "SELECT fileId FROM UserLikes LEFT JOIN Files ON UserLikes.fileId = Files.id WHERE UserLikes.userId='" . $userId . "' AND Files.bandId='" . $bandId . "';";
    }
    if ($result = mysqli_query($conn, $query)) {
      if ($result->num_rows > 0) {
        // Get current row as an array
        while ($row = mysqli_fetch_assoc($result)) {
          $fileIds[] = $row["fileId"];
        }
      }
    }
    return $fileIds;
  }

  // Get Files ids that the user has highlighted with -> $userId and $bandId
  function getUserHighlightedFileIds($conn, $userId, $bandId) {
    $fileIds = [];
    if ($bandId == "") {
      $query = "SELECT fileId FROM Highlights WHERE userId='" . $userId . "';";
    } else {
      $query = "SELECT fileId FROM Highlights WHERE userId='" . $userId . "' AND bandId='" . $bandId . "';";
    }
    if ($result = mysqli_query($conn, $query)) {
      if ($result->num_rows > 0) {
        // Get current row as an array
        while ($row = mysqli_fetch_assoc($result)) {
          $fileIds[] = $row["fileId"];
        }
      }
    }
    return $fileIds;
  }

  // Get Files ids for the files in a band with -> $bandId
  function getBandFileIds($conn, $bandId) {
      $fileIds = [];
      $query = "SELECT id FROM Files WHERE bandId='" . $bandId . "';";
      if ($result = mysqli_query($conn, $query)) {
          if ($result->num_rows > 0) {
            // Get current row as an array
            while ($row = mysqli_fetch_assoc($result)) {
              $fileIds[] = $row["id"];
            }
          }
      }
      return $fileIds;
  }

  // Get Files ids for the files in a band with -> $songId
  function getSongFileIds($conn, $songId) {
      $fileIds = [];
      $query = "SELECT id FROM SongFiles WHERE songId='" . $songId . "';";
      if ($result = mysqli_query($conn, $query)) {
          if ($result->num_rows > 0) {
            // Get current row as an array
            while ($row = mysqli_fetch_assoc($result)) {
              $fileIds[] = $row["fileId"];
            }
          }
      }
      return $fileIds;
  }

  // Get playlist file ids with -> $playlistId
  function getPlaylistFileIds($conn, $playlistId) {
    $fileIds = [];
    $query = "SELECT fileId FROM PlaylistFiles WHERE playlistId='" . $playlistId . "';";
    if ($result = mysqli_query($conn, $query)) {
      if ($result->num_rows > 0) {
        // Get current row as an array
        while ($row = mysqli_fetch_assoc($result)) {
          $fileIds[] = $row["fileId"];
        }
      }
    }
    return $fileIds;
  }

  // Get Highlights for a file
  function getFileHighlights($conn, $row) {
    // Check if the file has highlights
    $highlights = [];
    $highlightQuery = "SELECT * FROM Highlights WHERE fileId = '" . $row["id"] . "'";
    if ($highlightResult = mysqli_query($conn, $highlightQuery)) {
      if ($highlightResult->num_rows > 0) {
        while ($highlightRow = mysqli_fetch_assoc($highlightResult)) {
          $highlight = $highlightRow["comment"];
          $userName = findUserName($conn, $highlightRow["userId"]);
          if ($highlight != null) {
            $highlightObject = ['id' => $highlightRow["id"],
                              'comment' => $highlight,
                              'userName' => $userName,
                              'commentTime' => $highlightRow["commentTime"],
                              'highlightTime' => $highlightRow["highlightTime"],
                              'endTime' => $highlightRow["endTime"]];
            $highlights[] = $highlightObject;
          }
        }
      }
    }
    return $highlights;
  }

  // Get comments for a file
  function getFileComments($conn, $row) {
    // Check if the file has comments
    $comments = [];
    $commentQuery = "SELECT * FROM Comments WHERE fileId = '" . $row["id"] . "'";

    if ($commentResult = mysqli_query($conn, $commentQuery)) {
      if ($commentResult->num_rows > 0) {
        while ($commentRow = mysqli_fetch_assoc($commentResult)) {
          $comment = $commentRow["comment"];
          $userName = findUserName($conn, $commentRow["userId"]);
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
    return $comments;
  }

  // Find username with given id with -> $userId
  function findUserName($conn, $userId) {
    // Find user name
    $userName = "";
    $userQuery = "SELECT * FROM Users WHERE id = '" . $userId . "'";
    if ($userResult = mysqli_query($conn, $userQuery)) {
      if ($userResult->num_rows > 0) {
        while ($userRow = mysqli_fetch_assoc($userResult)) {
          $userName = $userRow["name"];
        }
      }
    }
    return $userName;
  }
?>
