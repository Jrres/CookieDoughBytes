<?php include_once 'includes/dbh.inc.php';
?>
<!Doctype html>
<html>
<head>
<title></title>
</head>
<body>
<?php
$sql = "SELECT * FROM logins;";
$result = mysqli_query($conn,$sql);
$resultCheck = mysqli_num_rows($result);

if($resultCheck >0){
  while($row=mysqli_fetch_assoc($result)){
    echo $row ['id'];
  }
}
?>
</body>
</html>
INSERT INTO users