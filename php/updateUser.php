<?php

  require 'data/dataHelper.php';
  require 'data/bandMembers.php';
  header('Content-Type: text/plain');
  $conn = connectToDatabase();
  date_default_timezone_set('CST6CDT');
  $postData = file_get_contents("php://input");
    $data = json_decode($postData);
    $userId = $_GET['userId'];
    $type = $_GET['type'];
    $bandId = "";

  if(mysqli_ping($conn)) {

    if ($type == "tokenUpdate") {
      $token = $data;
      echo $userId;
      $user = getUser($conn, $userId);
      $user = (object)$user;
      $lastloggedin = $user->loginDate;
      $query = "UPDATE Users SET token = '" . $token . "', loginDate = NOW(), lastloggedin = '" . $lastloggedin . "' WHERE id = '" . $userId . "';";
      if ($result = mysqli_query($conn, $query)) {
        echo "User update successful!";
      } else {
        echo "Sorry, it didn't work.";
        echo $query;
      }
    } else if ($type == "userImage") {
        $img = $data->icon;
        $query = "UPDATE Users SET userIcon = '" . $img . "' WHERE id = '" . $userId . "';";
        if ($result = mysqli_query($conn, $query)) {
          echo "User update successful!";
        } else {
          echo "Sorry, it didn't work.";
          echo $query;
        }
    } else if ($type == "userInfo") {
        $user = $data;
        $query = "UPDATE Users SET name = '" . $user->name . "', password = '" . $user->password . "', email = '" . $user->email . "' WHERE id = '" . $userId . "';";
        if ($result = mysqli_query($conn, $query)) {
          echo "User update successful!";
        } else {
          echo "Sorry, it didn't work.";
          echo $query;
        }
    } else if ($type == "bandUpdate") {
      $band = $data->metaName;
      // Find band id
      if ($result = mysqli_query($conn, "SELECT id FROM Bands WHERE metaName='" . $band . "'")) {
        if($row = mysqli_fetch_assoc($result)) {
          $bandId = $row["id"];

          $userQuery = "UPDATE Users SET bandIds = CONCAT(bandIds, '," . $bandId . "') WHERE id = '" . $userId . "';";

          $bandQuery = "UPDATE Bands SET memberIds = CONCAT(memberIds, '," . $userId . "') WHERE id = '" . $bandId . "';";

          if ($result = mysqli_query($conn, $userQuery)) {
            echo "User update successful!";
            if ($result = mysqli_query($conn, $bandQuery)) {
              echo "Band update successful!";
            } else {
              echo "Sorry, it didn't work.";
              echo $bandQuery;
            }
          } else {
            echo "Sorry, it didn't work.";
            echo $userQuery;
          }
        }

      } else {
        echo "Adding new band";
        if ($result = mysqli_query($conn, "SELECT MAX(id) AS `maxid` FROM Bands;")){
            // Find the new band id
            if($row = mysqli_fetch_assoc($result)) {
              $bandId = $row["maxid"] + 1;
            } else {
              // First Band
              $bandId = 1;
            }
         }

        $bandQuery = "INSERT INTO Bands (name, memberIds, code)
                    VALUES ('" . $band . "','" . $userId . "','1234')";
        echo "Inserting the new band...";

        if ($result = mysqli_query($conn, $bandQuery)) {
          echo "Success!";
        } else {
          echo "Sorry, it didn't work.";
          echo $bandQuery;
        }

        $userQuery = "UPDATE Users SET bandIds = CONCAT(bandIds, '," . $bandId . "') WHERE id = '" . $userId . "';";
        if ($result = mysqli_query($conn, $userQuery)) {
                  echo "Success!";
                } else {
                  echo "Sorry, it didn't work.";
                  echo $userQuery;
                }
      }
    }
  }


  mysqli_close($conn);

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
