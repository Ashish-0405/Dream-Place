
mapboxgl.accessToken = mapToken

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/standard', // style URL
    center: showListing.geometry.coordinates, // starting position [lng, lat]
    zoom: 13 // starting zoom
});

// console.log(mapCoordinates)

// Create a default Marker and add it to the map.
const marker1 = new mapboxgl.Marker({ color: "red" })
    .setLngLat(showListing.geometry.coordinates)// In model listing.geometry.coordinates
    .setPopup(new mapboxgl.Popup({offset:20})
    // .addClassName('some-class')
    .setHTML(`<p><b>${showListing.location}</b></p>`))
    // .setMaxWidth("500px")
    .addTo(map);

      // Add the control to the map.
    // Add the control to the map.
    // map.addControl(
    //     new MapboxGeocoder({
    //         mapToken: mapboxgl.accessToken,
    //         mapboxgl: mapboxgl
    //     })
    // );

// map.addControl(new mapboxgl.NavigationControl());
// map.scrollZoom;

// map.on('style.load', () => {
//     map.setFog({}); // Set the default atmosphere style
// });



