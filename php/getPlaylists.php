<?php
  require 'data/dataHelper.php';
  $conn = connectToDatabase();

  $id = "";
  $userId = "";
  $fileId = "";

  if(mysqli_ping($conn)) {
    $query = "";
    if(!empty($_GET['id'])) {
        $id = $_GET['id'];
        $playlist = getPlaylist($conn, $id);
        echo json_encode($playlist);
    } else if(!empty($_GET['fileId'])) {
        $userId = $_GET['userId'];
        $fileId = $_GET['fileId'];
        $playlists = getFilePlaylists($conn, $fileId, $userId);
        echo json_encode($playlists);
    } else {
        $userId = $_GET['userId'];
        $bandId = "";
        if(empty($_GET['bandId'])) {
            $query = "Select * From Playlists Where userId = '" . $userId . "'";
        } else {
            $bandId = $_GET['bandId'];
            $query = "Select * From Playlists Where bandId = '" . $bandId . "' And userId = '" . $userId . "'";
        }
        if ($result = mysqli_query($conn, $query)) {
            $playlists = [];
            if ($result->num_rows > 0) {
              // Get current row as an array
              while($row = mysqli_fetch_assoc($result)) {
                $numFiles;
                if ($numFilesResult = mysqli_query($conn, "SELECT id FROM PlaylistFiles WHERE playlistId = '" . $row["id"] . "'")) {
                    $numFiles = $numFilesResult->num_rows;
                }
                $data = ['id' => $row["id"],
                     'name' => $row["name"],
                     'bandId' => $row["bandId"],
                     'userId' => $userId,
                     'numFiles' => $numFiles];
                $playlists[] = $data;
              }
            } else {
              $data = new stdClass();
            }
            echo json_encode($playlists);
        } else {
          echo "Sorry, it didn't work.";
          echo $query;
        }
    }
  } else {
    echo "Error: " . msqli_error($conn);
  }


  mysqli_close($conn);

  function getFilePlaylists($conn, $fileId, $userId) {
    $playlistIds = [];
    $query = "Select * From PlaylistFiles Where fileId = '" . $fileId . "'";
    if ($result = mysqli_query($conn, $query)) {

        if ($result->num_rows > 0) {
          // Get current row as an array
          while($row = mysqli_fetch_assoc($result)) {
            $data = $row["playlistId"];
            $playlistIds[] = $data;
          }
        } else {
          $data = new stdClass();
        }
    } else {
      echo "Sorry, it didn't work.";
      echo $query;
    }
    $playlists = [];
    for ($i = 0; $i < count($playlistIds); $i++) {
        $query = "Select * From Playlists Where id = '" . $playlistIds[$i] . "' And userId = '" . $userId . "'";
        if ($result = mysqli_query($conn, $query)) {

            if ($result->num_rows > 0) {
              // Get current row as an array
              while($row = mysqli_fetch_assoc($result)) {

                  $data = ['id' => $row["id"],
                       'name' => $row["name"],
                       'bandId' => $row["bandId"],
                       'userId' => $row["userId"]];
                  $playlists[] = $data;
                }
            } else {
              $data = new stdClass();
            }

        } else {
          echo "Sorry, it didn't work.";
          echo $query;
        }
    }
    return $playlists;
  }

  function getPlaylist($conn, $id) {
    $query = "Select * From Playlists Where id = '" . $id . "'";
    $playlist = [];
    if ($result = mysqli_query($conn, $query)) {

        if ($result->num_rows > 0) {
          // Get current row as an array
          if($row = mysqli_fetch_assoc($result)) {

              $playlist = ['id' => $row["id"],
                   'name' => $row["name"],
                   'bandId' => $row["bandId"],
                   'userId' => $row["userId"],
                   'public' => $row["public"]
            ];
          }
        } else {
          $playlist = new stdClass();
        }

    } else {
      echo "Sorry, it didn't work.";
      echo $query;
    }
    return $playlist;
  }
?>
