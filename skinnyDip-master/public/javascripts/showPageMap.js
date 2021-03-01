mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v11', // style URL
    center: swimhole.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
});

new mapboxgl.Marker()
    .setLngLat(swimhole.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({offset: 25})
        .setHTML(
            `<h3>${swimhole.title}</h3>`
        )
    )
    .addTo(map)