<?php
  header('Content-Type: application/json');
  require 'data/dataHelper.php';
  require 'data/bandMembers.php';

  $conn = connectToDatabase();

  $username = $_GET['username'];
  $login = $_GET['login'];
  $data = "";

  if(mysqli_ping($conn)) {
    // Check in Database to see if user is logged in.
    if ($username == "") {
      if (rememberMe($username, $conn)) {
        echo getUser($username, $login, $conn);
      } else {
        echo "false";
      }
    } else {
      echo getUser($username, $login, $conn);
    }
  } else {
    echo "Error: " . msqli_error($conn);
  }

  mysqli_close($conn);

  function getUser($username, $login, $conn) {
    $query = "SELECT * FROM Users WHERE username = '" . $username . "'";

    if ($result = mysqli_query($conn, $query)) {
      if ($row = mysqli_fetch_assoc($result)) {
        $bands = getBands($row["id"], $conn);
        $data = ['id' => $row["id"],
             'name' => $row["name"],
             'username' => $row["username"],
             'email' => $row["email"],
             'password' => $row["password"],
             'lastloggedin' => $row["lastloggedin"],
             'loginDate' => $row["loginDate"],
             'bands' => $bands,
             'userIcon' => $row["userIcon"]];
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

  function getBands($userId, $conn) {
    $bandIds = getBandIds($userId, $conn);
    $bands = [];
    foreach ($bandIds as $id) {
      $query = "SELECT * FROM Bands WHERE id = '" . $id . "'";
      if ($result = mysqli_query($conn, $query)) {
        if ($row = mysqli_fetch_assoc($result)) {
          $numFiles;
          if ($result = mysqli_query($conn, "SELECT id FROM Files WHERE bandId = '" . $id . "'")) {
            $numFiles = $result->num_rows;
          }
          $band = ['id' => $row["id"],
                  'name' => $row["name"],
                  'metaName' => $row["metaName"],
                  'members' => getBandMembersByBandId($conn, $id),
                  'code' => $row["code"],
                  'numFiles' => $numFiles];
          $bands[] = $band;
        }
      }
    }
    return $bands;
  }

  function getBandIds($userId, $conn) {
    $bandIds = [];
    $query = "SELECT bandId FROM BandMembers WHERE userId = '" . $userId . "'";
    if ($result = mysqli_query($conn, $query)) {
      while ($row = mysqli_fetch_assoc($result)) {
        $bandId = $row["bandId"];
        $bandIds[] = $bandId;
      }
    }
    return $bandIds;
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
                  'username' => $row["username"],
                  'email' => $row["email"],
                  'lastloggedin' => $row["lastloggedin"],
                  'loginDate' => $row["loginDate"]
                ];
          $users[] = $user;
        }
      }
    }
    return $users;
  }

  function onLogin($user, $conn) {
    $SECRET_KEY = "BandOfIdeas";
    $token = bin2hex(openssl_random_pseudo_bytes(16)); // generate a token, should be 128 - 256 bit
    $query = "UPDATE Users SET token='" . $token . "', loginDate = NOW() WHERE id='" . $user->id . "';";
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

  function rememberMe(&$username, $conn) {
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
          $username = $row["username"];
          $userToken = $row["token"];
        }
      }
      if (hash_equals($userToken, $token)) {
        $query = "UPDATE Users SET lastloggedin = NOW() WHERE token='" . $userToken . "';";
        if ($result = mysqli_query($conn, $query)) {
          return true;
        } else {
          echo "Update unsuccessful";
          echo $query;
        }
      }
      else {
        return false;
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
