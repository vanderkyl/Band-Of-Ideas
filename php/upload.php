<?php
/*
set_time_limit(0);
ini_set('upload_max_filesize', '500M');
ini_set('post_max_size', '500M');
ini_set('max_input_time', 4000); // Play with the values
ini_set('max_execution_time', 4000); // Play with the values
*/
  $sqlUser = "kylevanderhoof";
  $sqlPW = "ashdrum10";
  $sqlDB = "IdeaBand";
  $bandName = $_GET['bandName'];
  $folderName = $_GET['folderName'];
  $bandDir = "../uploads/band/" . $bandName . "/";
  $targetDir = "../uploads/band/" . $bandName . "/" . $folderName . "/";
  $fileCount = $_FILES["files"]['size'][0];
  echo "File Size: " . $fileCount . "\n";
  // Rearray the files to upload to be able to work with them
  $uploadedFiles = reArrayFiles($_FILES["files"]);


  $uploadOk = 1;
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
        if (!file_exists($bandDir)) {
          echo "Band Dir: " . $bandDir . "\n";
          mkdir($bandDir, 0777, true);
        }
        if (!file_exists($targetDir)) {
          echo "Target Dir: " . $targetDir . "\n";
          mkdir($targetDir, 0777, true);
        }
        if (move_uploaded_file($file["tmp_name"], $targetFile)) {
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
            //$source = $file["source"];
            $source = "";
            echo "File Info: " . $name . "\n Type: " . $type . "\n Size: " . $size . "\n Link: " . $link;
            $query = "INSERT INTO Files (name, metaName, type, size, link, source, folderId)
                      VALUES ('" . $name . "','" . $name . "','" . $type . "','" . $size . "','" . $link . "','" . $source . "','" . $folderId . "')";
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
