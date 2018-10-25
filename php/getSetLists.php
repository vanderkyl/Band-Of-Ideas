<?php
  require 'data/dataHelper.php';
  $conn = connectToDatabase();

  $bandId = $_GET['bandId'];
  $userId = $_GET['userId'];


  if(mysqli_ping($conn)) {

    $query = "Select id, name From SetLists Where bandId = '" . $bandId . "' And userId = '" . $userId . "'";

    if ($result = mysqli_query($conn, $query)) {
      $setLists = [];
        if ($result->num_rows > 0) {
          // Get current row as an array
          while($row = mysqli_fetch_assoc($result)) {

            $data = ['id' => $row["id"],
                 'name' => $row["name"],
                 'bandId' => $bandId,
                 'userId' => $userId];
            $setLists[] = $data;
          }
        } else {
          $data = new stdClass();
        }
        echo json_encode($setLists);
      }
    } else {
      echo "Sorry, it didn't work.";
      echo $query;
    }




  mysqli_close($conn);
?>
