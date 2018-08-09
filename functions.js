function pad(num, size) {
	var s = num+"";
	while (s.length < size) s = "0" + s;
	return s;
};
  
function isEven(n) {
  return n == parseFloat(n)? !(n%2) : void 0;
}

function dirname(){
  var path = window.location.pathname;
  var levels = path.split("/");
  return levels[levels.length-3];
}
    
function daydiagram(input){
  $("#spektrum").html("");
  var dir = dirname();
  var selector;
  var now;
  var m;
  $("#date").html(input);
  m = moment(input,'MM/DD/YYYY');
  now = m.format('YYYYMMDD-');
  // Unterscheide ob heutiger Tag (nicht 24h voll) oder vorherige Tage mit 24h Datensatz
  if(m.isBefore(moment(),'day')){
	  var limit = 23;
  }
  else
  {
	  var limit = moment().format('H');
  }
  // generieren und abrufen der Spektrendateien
  for(selector=0; selector <= limit; selector++){
	tnow = pad(selector,2);
	var filename = dir + now + pad(selector,2) + "0201.png";
	var audiofilename = dir + now + pad(selector,2) + "0201.flac";
	console.log(filename);
	$("#spektrum").append('<div class="spektrum-tile"><a href="../' + audiofilename + '"> <img src="../' + filename + '" /></a><div class="spektrum-tile-label">'+ tnow + ':00</div></div>');

	}
  // Buttons neu definieren
  var start = moment('07/02/2018','MM/DD/YYYY');   // wir haben nur Daten ab 07/03/2018
  if( m.subtract(1,'days').isAfter(start)){
	var nextdate = m.format('L');
	$("#daybefore").attr("style", "visibility:visible");
	$("#daybefore").attr("onclick",'daydiagram("' + nextdate + '")' );
	$("#daybefore").html(nextdate);
	}
	else
	{
		$("#daybefore").attr("style", "visibility:hidden");
	}
  
  if(m.add(2,'days').isBefore(moment())){
	$("#dayafter").attr("style", "visibility: visible");
	nextdate = m.format('L');
	$("#dayafter").attr("onclick",'daydiagram("' + nextdate + '")' );
	$("#dayafter").html(nextdate);
	}
	else{
		$("#dayafter").attr("style", "visibility: visible");
		$("#dayafter").attr("onclick",'livediagram()');
		$("#dayafter").html('Liveansicht');
	}
	// -------------------- Temperaturkurve einbinden -------------------------------
	tempDay(input); 		
} 


// Funktion zum Anzeigen der Live-Daten
function tempLive(){
	$.ajax({
		url : "http://easyhive.fablab-cottbus.de/daria/test/charts.php",
		type : "GET", 
		success : function(data){

			arr = JSON.parse(data)
			var time = [];
			var temp_entry = [];
			var temp_inside = [];
			var temp_outside = [];
			
			for(var i in arr) {
				t1 = arr[i].time.split(" ")[1];
				t2 = t1.split(":")[0]+":"+t1.split(":")[1];
				time.push(t2);
				teE1 = arr[i].temp_entry.toString(); 
				teE2 = teE1.substr(0,2) + "." + teE1.substr(2,5);
				temp_entry.push(teE2);
				teI1 = arr[i].temp_inside.toString(); 
				teI2 = teI1.substr(0,2) + "." + teI1.substr(2,5);
				temp_inside.push(teI2);	
				teO1 = arr[i].temp_outside.toString(); 
				teO2 = teO1.substr(0,2) + "." + teO1.substr(2,5);
				temp_outside.push(teO2);

			}  	

			createGraph(time, temp_entry, temp_inside, temp_outside);
		
		},
		error : function(data) {

		}
		
  });
}


//Funktion zum Anzeigen der Temperaturkurve für ein bestimmtes Datum, das übergeben wird
function tempDay(day){
	d = moment(day,'MM/DD/YYYY');
  	date = d.format('YYYY-MM-DD');
  	console.log(date);
	$.ajax({ 
		url : "http://easyhive.fablab-cottbus.de/daria/test/charts.php" + "?date=" + date,
		type : "GET", 
		success : function(data){
			console.log("SUCCESS2");
			arr = JSON.parse(data)
			var time = [];
			var temp_entry = [];
			var temp_inside = [];
			var temp_outside = [];
			console.log("länge: " + data.length)
			for(var i in arr) {
				t1 = arr[i].time.split(" ")[1];
				t2 = t1.split(":")[0]+":"+t1.split(":")[1];
				time.push(t2);
				// todo: make this nicer! Maybe a second for loop to iterate over all columns in the array
				teE1 = arr[i].temp_entry.toString(); 
				teE2 = teE1.substr(0,2) + "." + teE1.substr(2,5);
				temp_entry.push(teE2);
				teI1 = arr[i].temp_inside.toString(); 
				teI2 = teI1.substr(0,2) + "." + teI1.substr(2,5);
				temp_inside.push(teI2);	
				teO1 = arr[i].temp_outside.toString(); 
				teO2 = teO1.substr(0,2) + "." + teO1.substr(2,5);
				temp_outside.push(teO2);
			}  	

			console.log(temp_entry)
			console.log(temp_outside)
			console.log(temp_inside)

			createGraph(time, temp_entry, temp_inside, temp_outside);

		},
		error : function(data) {

		}	
  });
}
  
function createGraph(time, temp_entry, temp_inside, temp_outside){
	// delete the canvas element containig the graph and add it again afterwards
	// reason: prevent overeffect (multiple graphs at the same time, switching by chance)
	$("#myChart").remove();
	$('#chart-container').append('<canvas id="myChart" ></canvas>');

	console.log(temp_entry)
	console.log(temp_outside)
	console.log(temp_inside)

	// create a new element
	var chartdata = {
		labels: time,
		datasets: [
		{
			label: "temp_entry",
			fill: false,
			lineTension: 0.1,
			backgroundColor: "rgba(255,215,0,0.5)",
			borderColor: "rgba(255,215,0,1)",
			pointHoverBackgroundColor: "rgba(255,215,0,1)",
			pointHoverBorderColor: "rgba(255,215,0,1)",
			data: temp_entry
		},
		{
			label: "temp_inside",
			fill: false,
			lineTension: 0.1,
			backgroundColor: "rgba(255,100,20,0.75)",
			borderColor: "rgba(255,100,20,1)",
			pointHoverBackgroundColor: "rgba(255,100,20,1)",
			pointHoverBorderColor: "rgba(255,100,20,1)",
			data: temp_inside
		},
		{
			label: "temp_outside",
			fill: false,
			lineTension: 0.1,
			backgroundColor: "rgba(59, 89, 152, 0.75)",
			borderColor: "rgba(59, 89, 152, 1)",
			pointHoverBackgroundColor: "rgba(59, 89, 152, 1)",
			pointHoverBorderColor: "rgba(59, 89, 152, 1)",
			data: temp_outside
		}
		]
	};

	var ctx = $("#myChart");

	window.LineGraph = new Chart(ctx, {
		type: 'line',
		data: chartdata,
		// axis labelling
	    options : {
	    	responsive: true,
	    	maintainAspectRatio: false,
	      scales: {
	        yAxes: [{
	          scaleLabel: {
	            display: true,
	            labelString: 'Temperature in °C'
	          }
	        }],
	       	xAxes: [{
	          scaleLabel: {
	            display: true,
	            labelString: 'Time'
	          }
	        }]
	      }
	    }	
	})
}


function livediagram(){
  $("#spektrum").html("");
  var dir = dirname();
  var selector;
  var now;
  now = moment().format('L');
  $("#datum").html(now);
  $("#dayafter").attr("style", "visibility:hidden");
  $("#daybefore").attr("onclick",'daydiagram("' + now + '")' );
  $("#daybefore").html('Tagesansicht');
  for(selector=24; selector >= 0; selector--){
	  if(isEven(moment().format('m'))){
			now = moment().subtract(selector*2+2, 'minutes').format('YYYYMMDD-HHmm01');
			tnow = moment().subtract(selector*2+2, 'minutes').format('HH:mm');
			}
		else
		{
			now = moment().subtract(selector*2+1, 'minutes').format('YYYYMMDD-HHmm01');
			tnow = moment().subtract(selector*2+1, 'minutes').format('HH:mm');
		}
	var filename = dir + now + ".png";
	var audiofilename = dir + now + ".flac";
	console.log(filename);
	$("#spektrum").append('<div class="spektrum-tile"><a href="../' + audiofilename + '"> <img src="../' + filename + '" /></a><div class="spektrum-tile-label">'+ tnow + '</div></div>');
	
  }
  //--------------------------------------- Einbinden der temperaturkurve ---------------------------------
	 tempLive();
}
    
  
$(document).ready(function(){
	
  
  livediagram();


});


