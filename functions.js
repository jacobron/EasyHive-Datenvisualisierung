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
	  if(m.isBefore(moment(),'day')){
		  var limit = 23;
	  }
	  else
	  {
		  var limit = moment().format('H');
	  }
	  for(selector=0; selector <= limit; selector++){
		tnow = pad(selector,2);
		var filename = dir + now + pad(selector,2) + "0201.png";
		var audiofilename = dir + now + pad(selector,2) + "0201.flac";
		console.log(filename);
		$("#spektrum").append('<div class="spektrum-tile"><a href="../' + audiofilename + '"> <img src="../' + filename + '" /></a><div class="spektrum-tile-label">'+ tnow + ':00</div></div>');
	
		}
	  var start = moment('07/02/2018','MM/DD/YYYY');
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
  }
    
  
$(document).ready(function(){
	
  
  livediagram();


});


