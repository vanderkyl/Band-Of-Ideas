<?php
  include 'data/dataHelper.php';
  // Get database connection
  $conn = connectToDatabase();
  // Retrieve Post Data
  $postData = file_get_contents("php://input");
  $data = json_decode($postData);
  $band = $data->bands[0]->name;
  $bandMetaName = $data->bands[0]->metaName;
  $username = $data->username;
  $email = $data->email;
  $name = $data->name;
  $metaName = $data->metaName;
  $password = $data->password;
  $existingBand = false;
  date_default_timezone_set('CST6CDT');
  // Set temp Ids
  $userId = "";
  $bandId = "";

  checkForConnectionError($conn);

  if(mysqli_ping($conn)) {
    $userId = findIdForNewRow($conn, "Users");

    if ($result = mysqli_query($conn, "SELECT id FROM Bands WHERE name='" . $band . "';")) {
      // Check if the band already exists
      if($row = mysqli_fetch_assoc($result)) {
        $bandId = $row["id"];
        $existingBand = true;
      } else {
        $bandId = findIdForNewRow($conn, "Bands");
      }
    } else {
      $userId = null;
      $bandId = null;
      echo "There was an error when trying to find user and band.";
    }
    $userQuery = "INSERT INTO Users (id, name, username, email, password, bandIds, token)
              VALUES ('" . $userId . "','" . $name . "','" . $username . "','" . $email . "','" . $password . "','" . $bandId . "','true')";
    runMySQLInsertQuery($conn, $userQuery);

    $bandQuery = "";
    if ($existingBand == false) {
      $bandQuery = "INSERT INTO Bands (id, name, metaName, code)
                VALUES ('" . $bandId . "','" . $band . "','" . $bandMetaName . "','1234')";
      echo "Inserting the new band...";
      runMySQLInsertQuery($conn, $bandQuery);

      $bandMemberId = findIdForNewRow($conn, "BandMembers");
      $bandMemberQuery = "INSERT INTO BandMembers (id, userId, bandId)
                  VALUES ('" . $bandMemberId . "','" . $userId . "','" . $bandId . "')";
      echo "Updating band members...";
      runMySQLInsertQuery($conn, $bandMemberQuery);

    } else {
      $bandMemberId = findIdForNewRow($conn, "BandMembers");
      $bandQuery = "INSERT INTO BandMembers (id, userId, bandId)
                VALUES ('" . $bandMemberId . "','" . $userId . "','" . $bandId . "')";
      echo "Updating band members...";
      runMySQLInsertQuery($conn, $bandQuery);
    }

  }

  mysqli_close($conn);
?>
