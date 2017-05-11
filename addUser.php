<?php
  $sqlUser = "kylevanderhoof";
  $sqlPW = "ashdrum10";
  $sqlDB = "IdeaBand";
  $conn = mysqli_connect("localhost", $sqlUser, $sqlPW, $sqlDB);
  $postData = file_get_contents("php://input");
  $data = json_decode($postData);
  $band = $data->bands[0];
  $email = $data->email;
  $firstName = $data->firstName;
  $lastName= $data->lastName;
  $password= $data->password;

  if($conn->connect_error) {
    echo "Failed to connect." . $conn->connect_error;
  }

  if(mysqli_ping($conn)) {
    $query = "INSERT INTO Users (firstName, lastName, email, password, bands)
              VALUES ('" . $firstName . "','" . $lastName . "','" . $email . "','" . $password . "','" . $band . "')";

    if ($result = mysqli_query($conn, $query)) {
      echo "New record created successfully!";
    } else {
      echo "Sorry, the user was not added.";
      echo $query;
    }
  }

  mysqli_close($conn);
?>
