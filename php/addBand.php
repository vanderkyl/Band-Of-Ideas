<?php
  require 'data/dataHelper.php';
  require 'data/bandMembers.php';
  $conn = connectToDatabase();

  $postData = file_get_contents("php://input");
  $data = json_decode($postData);
  $band = $data->bands[0]->name;
  $email = $data->email;
  $name = $data->name;
  $password = $data->password;
  $existingBand = $data->existingBand;
  $userId = "";
  $bandId = "";


  if(mysqli_ping($conn)) {



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
  }

  mysqli_close($conn);
?>
