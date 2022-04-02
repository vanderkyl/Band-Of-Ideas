<?php
  require 'data/dataHelper.php';
  $conn = connectToDatabase();

  $postData = file_get_contents("php://input");
  $data = json_decode($postData);


  if(mysqli_ping($conn)) {
    $type = $_GET["type"];
    if ($type == "lyrics") {
      $songId = $data->id;
      $lyrics = $data->lyrics;
      $query = "UPDATE Songs SET lyrics = " . $lyrics . " WHERE id = '" . $songId . "';";
      if ($result = mysqli_query($conn, $query)) {
        echo "Success!";
      } else {
        echo "Sorry, it didn't work.";
        echo $query;
      }
    } else if ($type == "arrangement") {
      $songId = $data->id;
      $arrangements = $data->arrangements;
      $query = "DELETE FROM SongArrangements WHERE $songId = '" . $songId . "';";
      if ($result = mysqli_query($conn, $query)) {
        echo "Deleting existing song arrangements was successful!";
      } else {
        echo "Sorry, it didn't work.";
        echo $query;
      }
      $numOfArrangements = count($arrangements);
      for ($i = 0; $i < $numOfArrangements; $i++) {
        $name = $arrangements[$i]->name;
        $orderIndex = $i + 1;
        $query = "INSERT INTO SongArrangements (name, songId, userId, orderIndex) VALUES ('" . $name . "','" . $songId . "','" . $userId  . "','" . $orderIndex . "');";;
        if ($result = mysqli_query($conn, $query)) {
          echo "Success!";
        } else {
          echo "Sorry, it didn't work.";
          echo $query;
        }
      }

    }
  }

  mysqli_close($conn);
?>
