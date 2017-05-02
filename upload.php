<?php
  $sqlUser = "kylevanderhoof";
  $sqlPW = "ashdrum10";
  $sqlDB = "IdeaBand";

  $targetDir = "../bandofideas.com/uploads/";
  $uploadedFiles = reArrayFiles($_FILES["files"]);
  $uploadOk = 1;
  foreach ($uploadedFiles as $file) {
    $targetFile = $targetDir . basename($file["name"]);
    // Check if file already exists
    if (file_exists($targetFile)) {
        echo "Sorry, file already exists.";
        $uploadOk = 0;
    }
    // Check file size
    if ($file["size"] > 5000000000) {
        echo "Sorry, your file is too large.";
        $uploadOk = 0;
    }

    // Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 0) {
        echo "Sorry, your file was not uploaded.";
    // if everything is ok, try to upload file
    } else {
      $conn = mysqli_connect("localhost", $sqlUser, $sqlPW, $sqlDB);

      if($conn->connect_error) {
        echo "Failed to connect." . $conn->connect_error;
      }
      if(mysqli_ping($conn)) {
        echo "Accepted";
      } else {
        echo "Error: " . msqli_error($conn);
      }
      $name = $file["name"];
      $type = $file["type"];
      $size = $file["size"];
      $link = "/uploads/" . $file["name"];
      $query = "INSERT INTO Files (name, type, size, link, folderId)
                VALUES ('" . $name . "','" . $type . "','" . $size . "','" . $link . "', '1')";

      if ($conn->query($query) === TRUE) {
        echo "New record created successfully!";
      } else {
        echo "Error: " . $query . "<br>" . $conn->error;
      }
      mysqli_close($conn);
      if (move_uploaded_file($file["tmp_name"], $targetFile)) {
          echo "The file ". basename( $file["name"]). " has been uploaded.";
      } else {
          echo "Sorry, there was an error uploading your file.";
      }

    }

  }



  function reArrayFiles(&$uploadedFiles) {
    $newArray = array();

    $fileCount = count($uploadedFiles['name']);

    $fileKeys = array_keys($uploadedFiles);
    for ($i = 0; $i < $fileCount; $i++) {
        foreach ($fileKeys as $key) {
            $newArray[$i][$key] = $uploadedFiles[$key][$i];
        }
    }

    return $newArray;
  }
?>
