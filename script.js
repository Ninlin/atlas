
    mapboxgl.accessToken = 'pk.eyJ1IjoibmlubGluIiwiYSI6ImNqanR0Zzc4bzI5b2Ezd2xlb2ZmbzdrOHMifQ.nhMfjVcApf7oZVzhlMnRLA';  // Replace with your Mapbox access token

    var map = new mapboxgl.Map({
        container: 'map',  // container ID
        style: 'mapbox://styles/ninlin/cloui6uq800tg01qy9myjdw5g',  // style URL
        center: [18.0686, 59.3293],  // starting position [lng, lat]
        zoom: 10  // starting zoom
    });

    map.on('load', function () {
        map.addSource('myGeojson', {
            'type': 'geojson',
            'data': 'http://storage.googleapis.com/mapbox-ninlin/sthlm_service.geojson'  // Replace with the path to your GeoJSON file
        });

        map.addLayer({
            'id': 'geojsonLayer',
            'type': 'fill',
            'source': 'myGeojson',
            'layout': {},
            'paint': {
                'fill-color':[
                    'step',
                    ['get', 'buffer_count'],
                    '#0047AB',  // Default color for value < 10
                    6, '#3288BD', // value >= 10
                    14, '#66C2A5', // value >= 20
                    21, '#ABDDA4', // value >= 30
                    35, '#E6F598',  // value >= 40
                    50, '#FFFFBF'
                ],
                'fill-opacity': 0.9
            }
        }, 'waterway');

        // Create a popup, but don't add it to the map yet.
    var tooltip = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    map.on('mousemove', 'geojsonLayer', function(e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';

        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.buffer_count;  // Replace 'buffer_count' with the actual property name

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates based on the feature.
        tooltip.setLngLat(e.lngLat)
            .setHTML("<strong>Number of services within 1 km:</strong> " +  description)
            .addTo(map);
    });

    map.on('mouseleave', 'geojsonLayer', function() {
        map.getCanvas().style.cursor = '';
        tooltip.remove();
    });
    });
