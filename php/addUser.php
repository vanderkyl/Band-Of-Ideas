<?php
  $sqlUser = "kylevanderhoof";
  $sqlPW = "ashdrum10";
  $sqlDB = "IdeaBand";
  $conn = mysqli_connect("localhost", $sqlUser, $sqlPW, $sqlDB);
  $postData = file_get_contents("php://input");
  $data = json_decode($postData);
  $band = $data->bands[0]->name;
  $email = $data->email;
  $name = $data->name;
  $password = $data->password;
  $existingBand = $data->existingBand;
  $userId = "";
  $bandId = "";

  if($conn->connect_error) {
    echo "Failed to connect." . $conn->connect_error;
  }

  if(mysqli_ping($conn)) {
    if ($result = mysqli_query($conn, "SELECT MAX(id) AS `maxid` FROM Users;")) {
      if($row = mysqli_fetch_assoc($result)) {
        $userId = $row["maxid"] + 1;
      } else {
        // First User
        $userId = 1;
      }
    }

    if ($result = mysqli_query($conn, "SELECT id FROM Bands WHERE name='" . $band . "';")) {
        // Check if the band already exists
      if($row = mysqli_fetch_assoc($result)) {
        $bandId = $row["id"];
        echo "bandId " . $bandId;
      } else if ($result = mysqli_query($conn, "SELECT MAX(id) AS `maxid` FROM Bands;")){
        // Find the new band id
        if($row = mysqli_fetch_assoc($result)) {
          $bandId = $row["maxid"] + 1;
        } else {
          // First Band
          $bandId = 1;
        }
      }
    } else {
      $userId = null;
      $bandId = null;
    }
    echo "band " . $bandId;
    echo "user " . $userId;
    $userQuery = "INSERT INTO Users (name, email, password, bandIds, loggedIn)
              VALUES ('" . $name . "','" . $email . "','" . $password . "','" . $bandId . "','true')";
    if ($result = mysqli_query($conn, $userQuery)) {
      echo "New record created successfully!";
    } else {
      echo "Sorry, the user was not added.";
      echo $userQuery;
    }

    $bandQuery = "";
    if ($existingBand == "") {
      $bandQuery = "INSERT INTO Bands (name, memberIds, code)
                VALUES ('" . $band . "','" . $userId . "','1234')";
      echo "Inserting the new band...";
    } else {
      $bandQuery = "UPDATE Bands SET memberIds = CONCAT(memberIds, '," . $userId . "') WHERE name = '" . $band . "';";
      echo "Updating existing band...";
    }
    if ($result = mysqli_query($conn, $bandQuery)) {
      echo "Success!";
    } else {
      echo "Sorry, it didn't work.";
      echo $bandQuery;
    }
  }

  mysqli_close($conn);
?>
