mapboxgl.accessToken =  mapToken; // use the global variable passed from EJS (show.ejs)
const map = new mapboxgl.Map({
    container: 'map',             // container(HTML div) ID to attach map
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: geoData.coordinates,  // Initial map center [lng, lat]
    zoom: 5                       // Initial zoom level
});

// Create a default Marker, colored (#fe424d), rotated 45 degrees
let marker = new mapboxgl.Marker({ color: '#fe424d', rotation: 45 })
    .setLngLat(geoData.coordinates)
    .addTo(map); // Add marker to map


// Create a popup
const popup = new mapboxgl.Popup({ offset: 25 })
    .setText('Glad to see you here!')
    .setMaxWidth('300px')

marker.setPopup(popup); // Add popup to marker

// Add controls (zoom buttons, geolocate control... etc) to the map
const controls = [
    new mapboxgl.NavigationControl({visualizePitch: true}),
    new mapboxgl.FullscreenControl(),
    new mapboxgl.ScaleControl(),
    new mapboxgl.GeolocateControl({ 
        positionOptions: {enableHighAccuracy: true},
        trackUserLocation: true,
        showUserHeading: true
    }),
];
controls.forEach(control => map.addControl(control));