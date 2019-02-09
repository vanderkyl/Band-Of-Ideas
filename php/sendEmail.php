<?php
    require 'data/dataHelper.php';
    $data = getPostData();
    $email = $data->email;
    $subject = $data->subject;
    $body = $data->body;
    $headers = "From: vanderhoof10@gmail.com";

    mail($email, $subject, $body, $headers);
?>