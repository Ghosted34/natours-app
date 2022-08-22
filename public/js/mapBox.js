export const displayMap = (locations) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiZ2hvc3RlZDM0IiwiYSI6ImNsNnF5MHkzajAyZ2kzbm83eXRlenZhYmUifQ.ogcNbzLpyT6o3MMw7TcUXQ";

  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/ghosted34/cl6rx80ym00il14pd1lt3dbk4",
  });
  map.scrollZoom.disable();

  const bounds = new mapboxgl.LngLatBounds();
  locations.forEach((location) => {
    const marker = document.createElement("div");
    marker.className = "marker";

    new mapboxgl.Marker({
      element: marker,
      anchor: "bottom",
    })
      .setLngLat(location.coordinates)
      .addTo(map);

    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(location.coordinates)
      .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
      .addTo(map);

    bounds.extend(location.coordinates);
  });

  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 100 },
  });
};
