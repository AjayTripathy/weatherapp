$(window).ready(function() {
	initiate_geolocation();
});

$.ajaxSetup({"error":function(XMLHttpRequest,textStatus,errorThrown) {
    alert(textStatus);
    }});

function initiate_geolocation() {
	navigator.geolocation.getCurrentPosition(handle_geolocation_query);
}

function handle_geolocation_query(position) {
//	alert('Lat: ' + position.coords.latitude + ' ' + 'Lon: ' + position.coords.longitude);
    var image_url = "http://maps.google.com/maps/api/staticmap?sensor=false&center=" + position.coords.latitude + "," + position.coords.longitude+"&zoom=14&size=300x400&markers=color:blue|label:S|"+position.coords.latitude+","+position.coords.longitude;
    $("#map").append(
    	$(document.createElement("img")).attr("src", image_url).attr("id","map")
    	);
    var lat = position.coords.latitude;
    var longitude = position.coords.longitude;

    $("#location").text("("+lat+","+longitude+")");
    sendLocation(position.coords.latitude+','+position.coords.longitude);
}
/*      
function sendLocation(place) {
    $.getJSON("http://ajt.no.de:9001?loc="+place+"&callback=?", function(result) {
        $("#temperature").text(result.data+" degrees Fahrenheit");
    });
    */

function sendLocation(place) {
  $.jsonp({
    url: "http://ajt.no.de:9001?loc="+place,
    callbackParameter: "callback",
    "success": function(result) {
      $("#temperature").html(result.data+ " &#176;F");
      },
    "error": function(d,msg) {
      $("#temperature").text("Error in retrieving data. :(");
      }
    });
}
