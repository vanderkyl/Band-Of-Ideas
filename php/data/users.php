<?php

  function getUserById($conn, $userId) {
    $query = "SELECT * FROM Users WHERE id = '" . $userId . "'";
    $bands = [];
    if ($result = mysqli_query($conn, $query)) {
      if($row = mysqli_fetch_assoc($result)) {
        $data = ['id' => $row["id"],
             'name' => $row["name"],
             'email' => $row["email"],
             'password' => $row["password"],
             'bands' => $bands];
      } else {
        $data = new stdClass();
      }
      return $data;
    }
  }
 ?>
