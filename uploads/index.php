<!DOCTYPE html>
<html>
  <head>
    <title>Band Uploads</title>
    <meta charset="UTF-8">
    <meta name="description" content="Band of Ideas">
    <meta name="keywords" content="music,ideas,bands,collaboration,share,message,videos,audio">
    <meta name="author" content="KHOOF">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="google-signin-client_id" content="528197877151-u6dq0rnndrkjcsflhfc7550dnleu9vju.apps.googleusercontent.com">
    <link rel="shortcut icon" href="../../favicon.ico" type="image/x-icon">
    <!-- Latest compiled and minified CSS -->
    <link rel="stylesheet" href="../../css/bootstrap/bootstrap-3.3.7.min.css">
    <!-- Optional theme -->
    <link rel="stylesheet" href="../../css/bootstrap/bootstrap-theme-3.3.7.min.css">
    <link rel="stylesheet" href="../../css/bootstrap/bootstrap-responsive.min.css">
    <!-- App Styling -->
    <link rel="stylesheet" href="../../css/app.css"/>
    <link rel="stylesheet" href="../../css/player.css"/>
    <link rel="stylesheet" href="../../css/style.css"/>
    <link rel="stylesheet" href="../../css/files.css"/>
    <link rel="stylesheet" href="../../css/form.css"/>
    <!-- Dependencies - Latest compiled and minified JavaScript -->
    <script src="../../js/dependencies/jquery/jquery-3.1.1.min.js" type="text/javascript"></script>
    <script src="../../js/dependencies/bootstrap/bootstrap-3.3.7.min.js" type="text/javascript"></script>
    <script src="../../js/dependencies/angular/angular-1.5.8.min.js" type="text/javascript"></script>
    <script src="../../js/dependencies/angular/angular-route-1.5.8.min.js" type="text/javascript"></script>
    <script src="../../js/dependencies/angular/angular-mocks-1.5.8.js" type="text/javascript"></script>
    <script src="../../js/dependencies/angular/angular-resource-1.5.8.min.js" type="text/javascript"></script>
  </head>
  <body style="color: #FFF">
    The link is this: <?php
      $link = "$_SERVER[REQUEST_URI]";
      $files = scandir(__DIR__ . "/band/");
      print_r($files);
    ?>

  </body>
</html>
