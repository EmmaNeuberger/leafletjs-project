// Store API link
var link =     'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';


// Perform a GET request to the query URL
d3.json(link, function(data) {
  createFeatures(data.features);
});


// Function to fill markers with colors depending on earthquake severity
function getColor(d) {
  return d > 6 ? '#FF0F7B' :
      d > 5 ? '#FC4D57' :
          d > 4 ? '#FA7C3B' :
              d > 3 ? '#F89B29' :
                  d > 2 ? '#F9AC32' :
                      d > 1 ? '#FBC13D' :
                          '#FFF95B';
}

// Funtion to create markersize relative to magnitude
function markerSize(mag) {
  return mag * 40000;
}


// Create Feautres
function createFeatures(earthquakeData) {

  var earthquakes = L.geoJSON(earthquakeData, {
  onEachFeature : function (feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
    },     pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: markerSize(feature.properties.mag),
        fillColor: getColor(feature.properties.mag),
        fillOpacity: 1,
        stroke: false,
    })
  }
  });
    


  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Satellite layer
  var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });

  // More Fun! Outdoor layer
  var outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Satellite": satellitemap,
    "Outdoors": outdoors
  };

  // Create overlay object to hold our overlay layer
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Default select satellite and earthquakes
  var myMap = L.map("map", {
    center: [32,-100],
    zoom: 2,
    layers: [outdoors, earthquakes]
  });

  // Create a layer control
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'topleft'});

  legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend'),
          magnitudes = [0, 1, 2, 3, 4, 5, 6];
  
      for (var i = 0; i < magnitudes.length; i++) {
          div.innerHTML +=
              '<i style="background:' + getColor(magnitudes[i] + 1) + '"></i> ' + 
      + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
      }
  
      return div;
  };
  
  legend.addTo(myMap);

}



  
