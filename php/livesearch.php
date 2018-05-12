<?php
$sqlUser = "kylevanderhoof";
$sqlPW = "ashdrum10";
$sqlDB = "IdeaBand";
$conn = mysqli_connect("localhost", $sqlUser, $sqlPW, $sqlDB);
//get the q parameter from URL
$searchString=$_GET["q"];
$bandId = $_GET["bandId"];

if($conn->connect_error) {
  echo "Failed to connect." . $conn->connect_error;
}

if(mysqli_ping($conn)) {
  $query = "SELECT * FROM Files WHERE name = '" . $name . "'";

  if ($result = mysqli_query($conn, $query)) {
    $data = "";
    if ($result->num_rows > 0) {
      // Get current row as an array
      while($row = mysqli_fetch_assoc($result)) {
        $data = ['id' => $row["id"],
                 'name' => $row["name"],
                 'metaName' => $row["metaName"],
                 'memberIds' => explode(',', $row["memberIds"]),
                 'code' => $row["code"]];
      }
    } else {
      $data = new stdClass();
    }
    echo json_encode($data);
  }
} else {
  echo "Error: " . msqli_error($conn);
}

mysqli_close($conn);

$xmlDoc=new DOMDocument();
$xmlDoc->load("links.xml");

$x=$xmlDoc->getElementsByTagName('link');



//lookup all links from the xml file if length of q>0
if (strlen($searchString) > 0) {
  $hint="";
  for($i=0; $i<($x->length); $i++) {
    $title=$x->item($i)->getElementsByTagName('title');
    $url=$x->item($i)->getElementsByTagName('url');
    if ($title->item(0)->nodeType==1) {
      //find a link matching the search text
      if (stristr($title->item(0)->childNodes->item(0)->nodeValue, $searchString)) {
        if ($hint=="") {
          $hint="<a href='" .
          $url->item(0)->childNodes->item(0)->nodeValue .
          "' target='_blank'>" .
          $title->item(0)->childNodes->item(0)->nodeValue . "</a>";
        } else {
          $hint=$hint . "<br /><a href='" .
          $url->item(0)->childNodes->item(0)->nodeValue .
          "' target='_blank'>" .
          $title->item(0)->childNodes->item(0)->nodeValue . "</a>";
        }
      }
    }
  }
}

// Set output to "no suggestion" if no hint was found
// or to the correct values
if ($hint=="") {
  $response="no suggestion";
} else {
  $response=$hint;
}

//output the response
echo $response;
?>
