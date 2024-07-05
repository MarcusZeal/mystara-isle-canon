![[mystara_isle.svg]]


```leaflet
id: Mystara Isle

lock: false
recenter: false
noScrollZoom: false
image: [[mystara_isle.svg]]
bounds: [[0,0], [1000, 1000]]
height: 1000px
width: 100%
lat: 500
long: 500
minZoom: -3
maxZoom: 3
defaultZoom: 1
zoomDelta: 0.5
unit: miles
scale: 1
darkMode: false
```

<div id="map"></div>
<script>
	// Initialize the map
	const map = L.map('map', {
		center: [500, 500],
		zoom: 1,
		minZoom: -3,
		maxZoom: 3,
		zoomDelta: 0.5,
		crs: L.CRS.Simple
	});

	// Define the bounds and image overlay
	const bounds = [[0, 0], [1000, 1000]];
	const image = L.imageOverlay('includes/img/mystara_isle.svg', bounds).addTo(map);

	// Set the map view to the bounds
	map.fitBounds(bounds);

	// Optional: Add scale control
	L.control.scale({ metric: false, imperial: true, maxWidth: 800 }).addTo(map);
</script>
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
<script src="includes/obsidian-leaflet.js"></script>