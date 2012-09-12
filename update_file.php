<?php

	$cpu_wins = $_POST["cpu_wins"];
	$total_wins = $_POST["total_wins"];
	
	 
	
	$fh = fopen("robot_wins.txt", 'w');
	
	fwrite($fh, $cpu_wins);
	fwrite($fh, $total_wins);
	fclose($fh);

?>

