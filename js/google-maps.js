

calculateGoogleRoute = function(map, from, to, selectedMode) {
    var directionsService = new google.maps.DirectionsService();
    var directionsRequest = {
      origin: from,
      destination: to,
      travelMode: google.maps.TravelMode["WALKING"],
      unitSystem: google.maps.UnitSystem.METRIC
    };

    directionsService.route(
      directionsRequest,
      function(response, status)	{
        if (status == google.maps.DirectionsStatus.OK) {
	       	if (response.routes.length >= 1) {
	       		var route = response.routes[0];
	       		var overview_path = route.overview_path;
	       		var points = [];
	       		overview_path.forEach(function(p) {
	       			points.push(new L.LatLng(p.lat(), p.lng()));
	       		})
	       		drawPoints(map, points);
	       	}
        }
        else {
			$("#error").append("Unable to retrieve your route<br />");
        }
      }
    );
}



