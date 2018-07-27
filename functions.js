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
		url : "http://easyhive.fablab-cottbus.de/daria/charts.php",
		type : "GET", 
		success : function(data){

			arr = JSON.parse(data)
			var time = [];
			var temperature = [];
			
			for(var i in arr) {
				t1 = arr[i].time.split(" ")[1];
				t2 = t1.split(":")[0]+":"+t1.split(":")[1];
				time.push(t2);
				te1 = arr[i].temperature.toString(); 
				te2 = te1.substr(0,2) + "." + te1.substr(2,5);
				temperature.push(te2);

			}  	

			createGraph(time, temperature);
		
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
			console.log("SUCCESS");
			arr = JSON.parse(data)
			var time = [];
			var temperature = [];
			
			for(var i in arr) {
				t1 = arr[i].time.split(" ")[1];
				t2 = t1.split(":")[0]+":"+t1.split(":")[1];
				time.push(t2);
				te1 = arr[i].temperature.toString(); 
				te2 = te1.substr(0,2) + "." + te1.substr(2,5);
				temperature.push(te2);

			}  	


			createGraph(time, temperature);

		},
		error : function(data) {

		}	
  });
}
  
function createGraph(time, temperature){
	// delete the canvas element containig the graph and add it again afterwards
	// reason: prevent overeffect (multiple graphs at the same time, switching by chance)
	$("#myChart").remove();
	$('#chart-container').append('<canvas id="myChart" ></canvas>');

	// create a new element
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


