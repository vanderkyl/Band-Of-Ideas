<?php
  require 'data/dataHelper.php';
  require 'data/bandMembers.php';

  $bandName = $_GET['bandName'];
  $folderName = $_GET['folderName'];
  $bandDir = "../uploads/band/" . $bandName . "/";
  $targetDir = "../uploads/band/" . $bandName . "/" . $folderName . "/";
  $fileCount = $_FILES["filepond"]['size'][0];
  echo "File Size: " . $fileCount . "\n";
  if ($fileCount > 0) {
      // Rearray the files to upload to be able to work with them
    $uploadedFiles = reArrayFiles($_FILES["filepond"]);


    $bandId = "";
    foreach ($uploadedFiles as $file) {
      $targetFile = $targetDir . basename($file["name"]);
      echo "Target File: " . $targetFile . "\n";
      // Check if file already exists
      if (file_exists($targetFile)) {
          echo "Sorry, file already exists.";
      } else {
        // Check file size
        if ($file["size"] > 5000000000) {
            echo "Sorry, your file is too large.";
        // if everything is ok, try to upload file
        } else {
          checkTargetDirectory($bandDir, $targetDir);
          if (move_uploaded_file($file["tmp_name"], $targetFile)) {
            $conn = connectToDatabase();

            if($conn->connect_error) {
              echo "Failed to connect." . $conn->connect_error;
            } else if(!mysqli_ping($conn)) {
              echo "Error: " . msqli_error($conn);
            } else {
              // Find band id
              if ($result = mysqli_query($conn, "SELECT id FROM Bands WHERE metaName='" . $bandName . "';")) {
                if($row = mysqli_fetch_assoc($result)) {
                  $bandId = $row["id"];
                  echo $bandId;
                }
              }
              // Find folder id
              if ($result = mysqli_query($conn, "SELECT id FROM Folders WHERE metaName='" . $folderName . "' AND bandId='" . $bandId . "';")) {
                if($row = mysqli_fetch_assoc($result)) {
                  $folderId = $row["id"];
                  echo $folderId;
                }
              }

              $name = $file["name"];
              $type = $file["type"];
              $size = $file["size"];
              $duration = $file["duration"];

              $link = "/uploads/band/" . $bandName . "/" . $folderName . "/" . $file["name"];
              //$source = $file["source"];
              $source = "";
              echo "File Info: " . $name . "\n Type: " . $type . "\n Size: " . $size . "\n Link: " . $link . "\n Duration: " . $duration;
              $query = "INSERT INTO Files (name, metaName, type, size, link, source, folderId, bandId, duration, uploadTime)
                        VALUES ('" . $name . "','" . $name . "','" . $type . "','" . $size . "','" . $link . "','" . $source . "','" . $folderId . "','" . $bandId . "','" . $duration . "', NOW())";
              if (!$conn->query($query) === TRUE) {
                echo "Query: " . $query . "\n";
                echo "Error: " . $query . "<br>" . $conn->error;
              }
              mysqli_close($conn);
              echo "The file ". basename( $file["name"]). " has been uploaded.";
            }

          } else {
            echo "Sorry, there was an error uploading your file. " . basename($file["name"]);
          }
        }
      }
      if(array_key_exists('file', $_FILES)){
        if ($_FILES['file']['error'] === UPLOAD_ERR_OK) {
           echo 'upload was successful';
        } else {
           die("Upload failed with error code " . $_FILES['files']['error']);
        }
      }
    }
  }


  function checkTargetDirectory($bandDir, $targetDir) {
    if (!file_exists($bandDir)) {
      echo "Band Dir: " . $bandDir . "\n";
      mkdir($bandDir, 0777, true);
    }
    if (!file_exists($targetDir)) {
      echo "Target Dir: " . $targetDir . "\n";
      mkdir($targetDir, 0777, true);
    }
  }

  function reArrayFiles(&$uploadedFiles) {
    $newArray = array();

    $fileCount = count($uploadedFiles['name']);
    echo "Number of files to upload: ";
    echo $fileCount . "\n";
    $fileKeys = array_keys($uploadedFiles);
    for ($i = 0; $i < $fileCount; $i++) {
        foreach ($fileKeys as $key) {
            $newArray[$i][$key] = $uploadedFiles[$key][$i];
        }
    }

    return $newArray;
  }
?>
