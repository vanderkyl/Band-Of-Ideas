<?php
  require 'data/dataHelper.php';
  require 'data/bandMembers.php';
  $conn = connectToDatabase();

  $postData = file_get_contents("php://input");
  $data = json_decode($postData);
  $band = $data->band->name;
  $bandMetaName = $data->band->metaName;
  $bandCode = $data->band->code;
  $userId = $data->userId;
  $joiningBand = $data->band->joiningBand;


  if(mysqli_ping($conn)) {


    // Insert Band
    $bandQuery = "";
    if ($joiningBand == false) {
      $bandId = findIdForNewRow($conn, "Bands");
      $bandQuery = "INSERT INTO Bands (id, name, metaName, code, creationDate)
                VALUES ('" . $bandId . "','" . $band . "','" . $bandMetaName . "',' . $bandCode . ', NOW())";
      echo "Inserting the new band...";
      runMySQLInsertQuery($conn, $bandQuery);

      $bandMemberId = findIdForNewRow($conn, "BandMembers");
      $bandMemberQuery = "INSERT INTO BandMembers (id, userId, bandId)
                  VALUES ('" . $bandMemberId . "','" . $userId . "','" . $bandId . "')";
      echo "Updating band members...";
      runMySQLInsertQuery($conn, $bandMemberQuery);

    } else {
      $bandId = $data->band->id;
      $bandMemberId = findIdForNewRow($conn, "BandMembers");
      $bandQuery = "INSERT INTO BandMembers (id, userId, bandId)
                VALUES ('" . $bandMemberId . "','" . $userId . "','" . $bandId . "')";
      echo "Updating band members...";
      runMySQLInsertQuery($conn, $bandQuery);
    }


  }

  mysqli_close($conn);
?>
