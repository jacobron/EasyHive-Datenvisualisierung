$(document).ready(function(){
				$.ajax({
					url : "http://easyhive.fablab-cottbus.de/daria/charts.php",
					type : "GET", 
					success : function(data){
						

						arr = JSON.parse(data)
						
					//	console.log(arr.length)
					//	console.log(arr[1].temperature)
						
						var time = [];
						var temperature = [];
						
						for(var i in arr) {
							time.push(arr[i].time);
							temperature.push(arr[i].temperature);
						}
						
						//console.log(temperature[1]);		

						var chartdata = {
							labels: time,
							datasets: [
							{
								label: "temp",
								fill: false,
								lineTension: 0.1,
								backgroundColor: "rgba(59, 89, 152, 0.75)",
								borderColor: "rgba(59, 89, 152, 1)",
								pointHoverBackgroundColor: "rgba(59, 89, 152, 1)",
								pointHoverBorderColor: "rgba(59, 89, 152, 1)",
								data: temperature
							}
							]
						};

						var ctx = $("#myChart");

						var LineGraph = new Chart(ctx, {
							type: 'line',
							data: chartdata,
							options: {
								responsive: true,
								maintainAspectRatio: false
							}

						});
					
					},
					error : function(data) {

					}
					
			  });
			});
			
			
