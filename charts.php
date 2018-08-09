<?php
	// Verbindung zum Datenbankserver
	$pdo = new PDO('mysql:host=127.0.0.1;dbname=d0284a05', 'd0284a05', 'fvRdwCF4VeKkbdnp');
	
	if (empty($_GET)){

		// the date and time before 48 minutes
		$date1 = date('Y-m-d H');
		$date2 = date('Y-m-d H', time()-2880);	
		
		// get the exact time till which the results shall be shwon (exactly 48minutes before "now")
		$date3 = date('Y-m-d H:i:s', time()-2880);
					
		$statement = $pdo->prepare("SELECT * FROM bienenpi2_temp WHERE time LIKE :time1 OR time LIKE :time2");
		$statement->execute(array('time1' => "%$date1%", 'time2' => "%$date2%"));  
		$result = $statement->fetchAll(PDO::FETCH_ASSOC); 
		
		$data = array();
		foreach($result as $row){
			if($row['time']>$date3)
			{
				$data[] = $row;
			
			}
		}	
	}

	else{
		//echo "date: ", $_GET["date"];
		$date = $_GET["date"];
		$statement = $pdo->prepare("SELECT * FROM bienenpi2_temp WHERE time LIKE :time1");
		$statement->execute(array('time1' => "%$date%"));  
		$result = $statement->fetchAll(PDO::FETCH_ASSOC); 
		
		$data = array();
		foreach($result as $row){
			$data[] = $row;
		}	

	}
	
	
	// $data = json_encode($data1,JSON_NUMERIC_CHECK);
	// print $data;
	// $main = array('data'=>array($data));
	// $data = $main;
	print json_encode($data, JSON_NUMERIC_CHECK|JSON_PRETTY_PRINT);
?>
		

