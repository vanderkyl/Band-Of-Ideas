<?php
  include 'dataHelper.php';
  // Get database connection
  $conn = connectToDatabase();
  // Retrieve Post Data
  $postData = file_get_contents("php://input");
  $data = json_decode($postData);
  $band = $data->bands[0]->name;
  $bandMetaName = $data->bands[0]->metaName;
  $email = $data->email;
  $name = $data->name;
  $metaName = $data->metaName;
  $password = $data->password;
  $existingBand = $data->existingBand;
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
      } else {
        $bandId = findIdForNewRow($conn, "Bands");
      }
    } else {
      $userId = null;
      $bandId = null;
      echo "There was an error when trying to find user and band.";
    }
    $userQuery = "INSERT INTO Users (id, name, email, password, bandIds, token)
              VALUES ('" . $userId . "','" . $name . "','" . $email . "','" . $password . "','" . $bandId . "','true')";
    runMySQLInsertQuery($conn, $userQuery);

    $bandQuery = "";
    if ($existingBand == "") {
      $bandQuery = "INSERT INTO Bands (id, name, metaName, memberIds, code)
                VALUES ('" . $bandId . "','" . $band . "','" . $bandMetaName . "','" . $userId . "','1234')";
      echo "Inserting the new band...";
    } else {
      $bandQuery = "UPDATE Bands SET memberIds = CONCAT(memberIds, '," . $userId . "') WHERE name = '" . $band . "';";
      echo "Updating existing band...";
    }
    runMySQLInsertQuery($conn, $bandQuery);
  }

  mysqli_close($conn);
?>
