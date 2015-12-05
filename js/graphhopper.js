


var basicRequest = function() {

   var defaultKey = "0edd0047-5b2f-47ca-81e8-4f1bf87b3851";

   var map = $("#kolorob-map");
   map.html("Test")

}


var createMap = function(divId) {
    var map = L.map(divId);
    // Mirpur 
    map.setView([23.8318897, 90.3684564], 13);
    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
    //map.setView([52.521235, 13.3992], 12);
    return map;
}


$(document).ready(function() {
	jQuery.support.cors = true;
	createMap("map");
})
