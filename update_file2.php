<?php
$saving = $_REQUEST['saving'];
if ($saving == 1){ 
$cpu_wins = $_POST['cpu_wins'];
$total_wins = $_POST['total_wins'];

$file = "robot_wins.txt"; 

$data = " $cpu_wins / $total_wins ";
$fp = fopen($file, "w") or die("Couldn't open $file for writing!");
fwrite($fp, $data) or die("Couldn't write values to file!"); 

fclose($fp); 
echo "Saved to $file successfully!";

}
?>