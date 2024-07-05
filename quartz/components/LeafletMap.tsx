import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

export default (() => {
  function LeafletMap(props: QuartzComponentProps) {
    return (
      <div data-shortcode>
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <aside>
          <h3>Map Goes Here</h3>
          <div id="map" style={{ height: "250px", width: "100%" }}></div>
        </aside>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          {`
            document.addEventListener(DOMContentLoaded, function () {
              function parseShortcode(shortcode) {
                const config = {};
                const lines = shortcode.split('\\n').map(line => line.trim()).filter(line => line);

                lines.forEach(line => {
                  const [key, value] = line.split(':').map(part => part.trim());
                  if (key === 'bounds' || key === 'image') {
                    config[key] = value;
                  } else {
                    config[key] = isNaN(value) ? value : Number(value);
                  }
                });

                config.bounds = JSON.parse(config.bounds.replace(/\\[\\[(.*?)\\]\\]/g, '[$1]'));
                config.image = config.image.replace(/\\[\\[(.*?)\\]\\]/, '$1');

                return config;
              }

              function initializeMap(mapConfig, markers) {
                const map = L.map('map').setView([mapConfig.lat, mapConfig.long], mapConfig.defaultZoom);

                L.tileLayer(mapConfig.defaultTile || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                  maxZoom: mapConfig.maxZoom,
                  minZoom: mapConfig.minZoom,
                  attribution: mapConfig.defaultAttribution || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                }).addTo(map);

                markers.forEach(marker => {
                  L.marker([marker.loc[0], marker.loc[1]])
                    .addTo(map)
                    .bindPopup(marker.link);
                });
              }

              const shortcode = document.querySelector('[data-shortcode]').dataset.shortcode;
              const mapConfig = parseShortcode(shortcode);

              fetch('/includes/data.json')
                .then(response => response.json())
                .then(data => {
                  const markers = data.mapMarkers.find(markerData => markerData.id === mapConfig.id).markers;
                  initializeMap(mapConfig, markers);
                })
                .catch(error => console.error('Error fetching pin data:', error));

              document.addEventListener('nav', () => {
                initializeMap(mapConfig, markers);
              });

              initializeMap(mapConfig, markers);
            });
          `}
        </script>
      </div>
    )
  }

  return LeafletMap
}) satisfies QuartzComponentConstructor
