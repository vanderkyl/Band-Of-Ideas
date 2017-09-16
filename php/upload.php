<?php
  $sqlUser = "kylevanderhoof";
  $sqlPW = "ashdrum10";
  $sqlDB = "IdeaBand";
  $bandName = $_GET['bandName'];
  $folderName = $_GET['folderName'];
  $bandDir = "../uploads/band/" . $bandName . "/";
  $targetDir = "../uploads/band/" . $bandName . "/" . $folderName . "/";
  $uploadedFiles = reArrayFiles($_FILES["files"]);
  $uploadOk = 1;
  $bandId = "";

  foreach ($uploadedFiles as $file) {
    $targetFile = $targetDir . basename($file["name"]);
    // Check if file already exists
    if (file_exists($targetFile)) {
        echo "Sorry, file already exists.";
        $uploadOk = 0;
    } else {
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
        } else if(!mysqli_ping($conn)) {
          echo "Error: " . msqli_error($conn);
        } else {
          // Find band id
          if ($result = mysqli_query($conn, "SELECT id FROM Bands WHERE metaName='" . $bandName . "';")) {
            if($row = mysqli_fetch_assoc($result)) {
              $bandId = $row["id"];
            }
          }
          // Find folder id
          if ($result = mysqli_query($conn, "SELECT id FROM Folders WHERE metaName='" . $folderName . "' AND bandId='" . $bandId . "';")) {
            if($row = mysqli_fetch_assoc($result)) {
              $folderId = $row["id"];
            }
          }
          $name = $file["name"];
          $type = $file["type"];
          $size = $file["size"];
          $link = "/uploads/band/" . $bandName . "/" . $folderName . "/" . $file["name"];
          $query = "INSERT INTO Files (name, metaName, type, size, link, folderId)
                    VALUES ('" . $name . "','" . $name . "','" . $type . "','" . $size . "','" . $link . "','" . $folderId . "')";

          if (!$conn->query($query) === TRUE) {
            echo "Error: " . $query . "<br>" . $conn->error;
          }
          mysqli_close($conn);

          if (!file_exists($bandDir)) {
            echo "Band Dir: " . $bandDir . "\n";
            mkdir($bandDir, 0777, true);
          }
          if (!file_exists($targetDir)) {
            echo "Target Dir: " . $targetDir . "\n";
            mkdir($targetDir, 0777, true);
          }
          if (move_uploaded_file($file["tmp_name"], $targetFile)) {
            echo "The file ". basename( $file["name"]). " has been uploaded.";
          } else {
            echo "Sorry, there was an error uploading your file.";
          }
        }
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
