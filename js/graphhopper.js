


var defaultKey = "0edd0047-5b2f-47ca-81e8-4f1bf87b3851";
var profile = "car";

var basicRequest = function() {


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

var routePoints = function() {
	var host;
	var ghRouting = new GraphHopperRouting({key: defaultKey, host: host, vehicle: profile, elevation: false});
	return ghRouting;
}

var setupRoutingAPI = function(map, ghRouting) {
    var iconObject = L.icon({
        iconUrl: './img/marker-icon.png',
        shadowSize: [50, 64],
        shadowAnchor: [4, 62],
        iconAnchor: [12, 40]
    });
    var instructionsDiv = $("#instructions");

    ghRouting.clearPoints();
    var routingLayer = L.geoJson().addTo(map);
    routingLayer.options = {
        style: {color: "#00cc33", "weight": 5, "opacity": 0.6}
    };
    // routingLayer.clearLayers();
    var point1 = new L.LatLng(23.821437, 90.359519);
    var point2 = new L.LatLng(23.8225494, 90.3780977);
    var marker1 = L.marker(point1, {icon: iconObject}).addTo(routingLayer);
    var marker2 = L.marker(point2, {icon: iconObject}).addTo(routingLayer);

    // map.on('click', function (e) {
        // if (ghRouting.points.length > 1) {
        //     ghRouting.clearPoints();
        //     routingLayer.clearLayers();
        // }
		
        ghRouting.addPoint(new GHInput(point1.lat, point1.lng));
        ghRouting.addPoint(new GHInput(point2.lat, point2.lng));

        // ******************
        //  Calculate route! 
        // ******************
        ghRouting.doRequest(function (json) {
            if (json.message) {
                var str = "An error occured: " + json.message;
                if (json.hints)
                    str += json.hints;

                $("#routing-response").text(str);

            } else {
                var path = json.paths[0];
                routingLayer.addData({
                    "type": "Feature",
                    "geometry": path.points
                });
                var outHtml = "Distance in meter:" + path.distance;
                outHtml += "<br/>Times in seconds:" + path.time / 1000;
                outHtml += "<br/><a href='" + ghRouting.getGraphHopperMapsLink() + "'>GraphHopper Maps</a>";
                $("#routing-response").html(outHtml);

                if (path.bbox) {
                    var minLon = path.bbox[0];
                    var minLat = path.bbox[1];
                    var maxLon = path.bbox[2];
                    var maxLat = path.bbox[3];
                    var tmpB = new L.LatLngBounds(new L.LatLng(minLat, minLon), new L.LatLng(maxLat, maxLon));
                    map.fitBounds(tmpB);
                }

                instructionsDiv.empty();
                if (path.instructions) {
                    var allPoints = path.points.coordinates;
                    var listUL = $("<ol>");
                    instructionsDiv.append(listUL);
                    for (var idx in path.instructions) {
                        var instr = path.instructions[idx];

                        // use 'interval' to find the geometry (list of points) until the next instruction
                        var instruction_points = allPoints.slice(instr.interval[0], instr.interval[1]);

                        // use 'sign' to display e.g. equally named images

                        $("<li>" + instr.text + " <small>(" + ghRouting.getTurnText(instr.sign) + ")</small>"
                                + " for " + instr.distance + "m and " + Math.round(instr.time / 1000) + "sec"
                                + ", geometry points:" + instruction_points.length + "</li>").
                                appendTo(listUL);
                    }
                }
            }
        });
    // });

    var instructionsHeader = $("#instructions-header");
    instructionsHeader.click(function () {
        instructionsDiv.toggle();
    });

    var routingLayer = L.geoJson().addTo(map);
    routingLayer.options = {
        style: {color: "#00cc33", "weight": 5, "opacity": 0.6}
    };
}

$(document).ready(function() {
	jQuery.support.cors = true;
	var map = createMap("map");
	var ghRouting = routePoints();
	setupRoutingAPI(map, ghRouting);

})
