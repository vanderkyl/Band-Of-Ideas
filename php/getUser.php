<?php
  header('Content-Type: application/json');
  $sqlUser = "kylevanderhoof";
  $sqlPW = "ashdrum10";
  $sqlDB = "IdeaBand";
  $conn = mysqli_connect("localhost", $sqlUser, $sqlPW, $sqlDB);
  $email = $_GET['email'];
  $login = $_GET['login'];
  $data = "";


  if($conn->connect_error) {
    echo "Failed to connect." . $conn->connect_error;
  }

  if(mysqli_ping($conn)) {
    // Check in Database to see if user is logged in.
    if ($email == "") {
      if (rememberMe($email, $conn)) {
        echo getUser($email, $login, $conn);
      } else {
        echo "false";
      }
    } else {
      echo getUser($email, $login, $conn);
    }
  } else {
    echo "Error: " . msqli_error($conn);
  }


  mysqli_close($conn);

  function getUser($email, $login, $conn) {
    $query = "SELECT * FROM Users WHERE email = '" . $email . "'";

    if ($result = mysqli_query($conn, $query)) {
      if ($row = mysqli_fetch_assoc($result)) {
        $bands = getBands($row["bandIds"], $conn);
        $data = ['id' => $row["id"],
             'name' => $row["name"],
             'email' => $row["email"],
             'password' => $row["password"],
             'bands' => $bands];
      } else {
        $data = new stdClass();
      }
      $data = json_encode($data);

      if ($login == "true") {
        onLogin(json_decode($data), $conn);
      }
      return $data;
    }
  }

  function getBands($bandIds, $conn) {
    $bandArray = explode(',', $bandIds);
    $bands = [];
    foreach ($bandArray as $id) {
      $query = "SELECT * FROM Bands WHERE id = '" . $id . "'";
      if ($result = mysqli_query($conn, $query)) {
        if ($row = mysqli_fetch_assoc($result)) {
          $band = ['id' => $row["id"],
                  'name' => $row["name"],
                  'metaName' => $row["metaName"],
                  'memberIds' => getMembers($row["memberIds"], $conn),
                  'code' => $row["code"]];
          $bands[] = $band;
        }
      }
    }
    return $bands;
  }

  function getMembers($userIds, $conn) {
    $userArray = explode(',', $userIds);
    $users = [];
    foreach ($userArray as $id) {
      $query = "SELECT * FROM Users WHERE id = '" . $id . "'";
      if ($result = mysqli_query($conn, $query)) {
        if ($row = mysqli_fetch_assoc($result)) {
          $user = ['id' => $row["id"],
                  'name' => $row["name"],
                  'email' => $row["email"]];
          $users[] = $user;
        }
      }
    }
    return $users;
  }

  function onLogin($user, $conn) {
    $SECRET_KEY = "BandOfIdeas";
    $token = bin2hex(openssl_random_pseudo_bytes(16)); // generate a token, should be 128 - 256 bit
    $query = "UPDATE Users SET token='" . $token . "' WHERE id='" . $user->id . "';";
    if ($result = mysqli_query($conn, $query)) {
      // User updated successfully
      $cookie = $user->id . ':' . $token;
      $mac = hash_hmac('sha256', $cookie, $SECRET_KEY);
      $cookie .= ':' . $mac;
      setcookie('rememberme', $cookie);
    } else {
      echo "Update unsuccessful";
      echo $query;
    }

  }

  function rememberMe(&$email, $conn) {
    $SECRET_KEY = "BandOfIdeas";

    $cookie = isset($_COOKIE['rememberme']) ? $_COOKIE['rememberme'] : '';
    if ($cookie) {
      list ($user, $token, $mac) = explode(':', $cookie);

      if (!hash_equals(hash_hmac('sha256', $user . ':' . $token, $SECRET_KEY), $mac)) {
          return false;
      }
      $query = "SELECT * FROM Users WHERE token = '" . $token . "'";
      $userToken = "";
      if ($result = mysqli_query($conn, $query)) {
        if ($row = mysqli_fetch_assoc($result)) {
          $email = $row["email"];
          $userToken = $row["token"];
        }
      }
      if (hash_equals($userToken, $token)) {
          return true;
      }
    }
  }
  /*
  /**
   * A timing safe equals comparison
   *
   * To prevent leaking length information, it is important
   * that user input is always used as the second parameter.
   *
   * @param string $safe The internal (safe) value to be checked
   * @param string $user The user submitted (unsafe) value
   *
   * @return boolean True if the two strings are identical.
   */
   /*
  function timingSafeCompare($safe, $user) {
      if (function_exists('hash_equals')) {
          return hash_equals($safe, $user); // PHP 5.6
      }
      // Prevent issues if string length is 0
      $safe .= chr(0);
      $user .= chr(0);

      // mbstring.func_overload can make strlen() return invalid numbers
      // when operating on raw binary strings; force an 8bit charset here:
      if (function_exists('mb_strlen')) {
          $safeLen = mb_strlen($safe, '8bit');
          $userLen = mb_strlen($user, '8bit');
      } else {
          $safeLen = strlen($safe);
          $userLen = strlen($user);
      }

      // Set the result to the difference between the lengths
      $result = $safeLen - $userLen;

      // Note that we ALWAYS iterate over the user-supplied length
      // This is to prevent leaking length information
      for ($i = 0; $i < $userLen; $i++) {
          // Using % here is a trick to prevent notices
          // It's safe, since if the lengths are different
          // $result is already non-0
          $result |= (ord($safe[$i % $safeLen]) ^ ord($user[$i]));
      }

      // They are only identical strings if $result is exactly 0...
      return $result === 0;
  } */
?>
