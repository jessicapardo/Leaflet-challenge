// Define and store map url
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


// Define markerSize ratio
function markerSize(mag) {
    return mag * 3;
}

// Define markerColor
function markerColor(magnitude) {
    if (magnitude <= 1) {
        return "#E6DCE9";
    } else if (magnitude <= 2) {
        return "#63ADF2";
    } else if (magnitude <= 3) {
        return "#66FFBF";
    } else if (magnitude <= 4) {
        return "#3DFF57";
    } else if (magnitude <= 5) {
        return "#F5F500";
    } else {
        return "#FF0000";
    };
}

// Create map function and features
// GET request to the URL
d3.json(url, function (data) {

    createMyFeatures(data.features);
});

function createMyFeatures(data) {
    // Add GeoJSON layer to myMap and set style for circleMarker
    let earthquake = L.geoJson(data, {

        onEachFeature: function (feature, layer) {
            layer.bindPopup("<p><h3>Location: " + feature.properties.place +
                "</h3><hr><p>" + "<p/>" + new Date(feature.properties.time) + "<br><p><h3>Magnitude: " + feature.properties.magnitude + "</h3></p>");
        },

        pointToLayer: function (feature, latlng) {
            return new L.circleMarker(latlng, {
                fillColor: markerColor(feature.properties.mag),
                radius: markerSize(feature.properties.mag),
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8,
                stroke: true,
                weight: 0.5

            });
        },
    });
    createMap(earthquake);
}

function createMap(earthquake) {

    // Create the tile layer that will be the background of our map
    let lightMap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/light-v9',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: API_KEY
    });

    // Create overlay object to hold our overlay layer
    let overLays = {
        Earthquakes: earthquake
    };

    // Create the map object, centroid, zoom level and layer, which gets inserted into the div
    let myMap = L.map("map", {
        center: [38.88, -77.03],
        zoom: 2,
        layers: [lightMap, earthquake]
    });

    // Adding legend and correspondant details
    let legend = L.control({ position: 'bottomright' });

    legend.onAdd = function () {

        let div = L.DomUtil.create('div', 'info legend');
        let magnitudes = [0, 1, 2, 3, 4, 5];
        let colors = ["#E6DCE9", "#63ADF2", "#66FFBF", "#3DFF57", "#F5F500", "#FF0000"];

        //Legend Label Earthquake <break> Magnitude  
        div.innerHTML = 'Eathquake<br>Magnitude<br><hr>'

        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML +=
                '<i class="color-key" style="background:' +
                colors[i] +
                '; color: ">' +
                '</i> ' +
                +magnitudes[i] +
                (magnitudes[i + 1]
                    ? ' - ' + magnitudes[i + 1] + '<br>'
                    : ' <i style="margin-left: 5px;">+</i> ');
        }

        return div;
    };

    legend.addTo(myMap);

};