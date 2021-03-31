<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "logins";

// sql to create table
$sql="CREATE TABLE logins (
	id int(11) not null PRIMARY KEY AUTO_INCREMENT/*  */,
    subject varchar(128) not null,
    content varchar(1000) not null,
    date datetime not null
    insert into logins (subject, content, date) VALUES ('steam','balaldsddasdd','2021-3-9 1:48:01');
)";
// Create connection
$conn = new mysql($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}


?>