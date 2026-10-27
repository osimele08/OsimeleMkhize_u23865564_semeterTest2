// Step:  Create the map 

var map = L.map('map').setView([-25.75, 28.23], 15);

L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//Step 3: Add the overlayLayer to the document 
const overlayLayers = {};

async function loadGeoJSON(fileName, layerName, styleOptions = {}) {
  try {
    const response = await fetch ("./data/${filename}");
    if (!response.ok) throw new Error("Could not find ${fileName}");

    const geojsonData = await response.json();

    const layer = L.geoJSON(geojsonData, {
      style: () => styleOptions,

      pointToLayer: (feature, latlng) =>
    L.circleMarker(latlng, { radius: 7, fillOpacity: 0.9 }),

      onEachFeature: (feature, featureLayer) => {
    featureLayer.bindPopup(layerName);
}
    }).addTo(map);

    overlayLayers[layerName] = layer;

  } catch (error) {
    
    return null;
  }
}


// 5. Load all layers from FarmtechAfrica individually
async function loadFarmLayers() {
  const boundary = await loadGeoJSON("UP_farm_aoi.geojson", "Farm Boundary",
    { color: "#174b35", fillColor: "#d1d108", fillOpacity: 0.08, weight: 3 });

  await loadGeoJSON("irrigation.geojson", "Irrigation",
    { color: "#168aad", fillColor: "#48cae4", fillOpacity: 0.7, weight: 2 });

  await loadGeoJSON("roads.geojson", "Roads",
    { color: "#555555", weight: 4 });

  await loadGeoJSON("building.geojson", "Buildings",
    { color: "#8b4513", fillColor: "#d9a066", fillOpacity: 0.8, weight: 2 });

  await loadGeoJSON("tree.geojson", "Trees",
    { color: "#1b5e20", fillColor: "#66bb6a" });

  await loadGeoJSON("rainwater_tank.geojson", "Rainwater Tanks",
    { color: "#1565c0", fillColor: "#42a5f5" }); 

  await loadGeoJSON("sensor.geojson", "Sensors",
    { color: "#b71c1c", fillColor: "#ff5252" });

  // Step 6: Creating a layer switcher 
  L.control.layers({ OpenStreetMap: osm }, overlayLayers, { collapsed: false }).addTo(map);

  // Step7: allowing zoom to the farm
  if (boundary && boundary.getBounds().isValid()) {
    map.fitBounds(boundary.getBounds(), { padding: [20, 20] });
  } else {
    map.setView([-25.75, 28.23], 15);
  }
}

// Step 8: Creating the Scale bar
L.control.scale({ position: "bottomleft", imperial: false }).addTo(map);

// Step 9: Running 
loadFarmLayers();

// Step 10: Creating the lengend
const legend = L.control({ position: "bottomright" });

legend.onAdd = function () {
  const div = L.DomUtil.create("div", "legend");
  div.innerHTML = `
    <b>Legend</b><br>
    <i style="background:#d1d108"></i> Farm Boundary<br>  
    <i style="background:lightblue"></i> Irrigation<br>
    <i style="background:#grey"></i> Roads<br>
    <i style="background:#d9a066"></i> Buildings<br>
    <i style="background:green"></i> Trees<br>
    <i style="background:blue"></i> Rainwater Tanks<br>
    <i style="background:red"></i> Sensors
  `;
  return div;
};

// Step 11: Creating the North Arrow at the top 
const north = L.control({ position: "topright" });

north.onAdd = function () {
  const div = L.DomUtil.create("div", "north-arrow");
  div.innerHTML = `
    <svg width="30" height="48" viewBox="0 0 30 48">
      <polygon points="15,2 27,44 15,34 3,44" fill="#222"/>
    </svg>
  `;
  return div;
};

north.addTo(map);

legend.addTo(map);




