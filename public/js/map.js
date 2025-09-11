async function initMap() {
    const map = new maplibregl.Map({
        container: 'mapContainer',
        style: 'https://tiles.stadiamaps.com/styles/osm_bright/style.json', // free OSM style
        center: [77.2090, 28.6139], // Delhi [lng, lat]
        zoom: 10
    });

    const address = "<%= listing.location %>, <%= listing.country %>";

    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
        const data = await response.json();

        if (data && data.length > 0) {
            const lng = parseFloat(data[0].lon);
            const lat = parseFloat(data[0].lat);

            map.setCenter([lng, lat]);
            map.setZoom(14);

            new maplibregl.Marker()
                .setLngLat([lng, lat])
                .setPopup(new maplibregl.Popup().setText("<%= listing.title %>"))
                .addTo(map);
        } else {
            console.error("Location not found");
        }
    } catch (err) {
        console.error("Error fetching coordinates:", err);
    }
}

// Call the function
initMap();
