import mapData from "../../../content/includes/data.json"
import { QuartzTransformerPlugin } from "../types"

interface Options {
  dataUrl: string
}

export const LeafletMap: QuartzTransformerPlugin<Options> = (opts?: Options) => {
  return {
    name: "LeafletMap",
    textTransform(ctx, src) {
      if (!mapData) {
        console.warn("Map data not loaded yet.")
        return src
      }

      if (typeof src === "string") {
        return src.replace(/<code data-language="leaflet"[\s\S]*?<\/code>/g, (match: string) => {
          const mapId = `leaflet-map-${Math.random().toString(36).substr(2, 9)}`

          // Extract the configuration from the code snippet
          const config: any = {}
          const lines = match.split("\n")
          lines.forEach((line) => {
            const match = line.match(/<span[^>]*>([^:]+):\s*([^<]+)<\/span>/)
            if (match) {
              config[match[1].trim()] = match[2].trim()
            }
          })

          const lat = parseFloat(config.lat) || 51.505
          const long = parseFloat(config.long) || -0.09
          const zoom = parseFloat(config.defaultZoom) || 13

          return `
<div id="${mapId}" style="height: ${config.height || "500px"}; width: ${
            config.width || "100%"
          };"></div>
<script>
  document.addEventListener("DOMContentLoaded", function() {
    const map = L.map("${mapId}").setView([${lat}, ${long}], ${zoom});
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    ${mapData.mapMarkers
      .find((map) => map.id === "Mystara Isle")
      ?.markers.map(
        (pin) =>
          `L.marker([${pin.loc[0]}, ${pin.loc[1]}]).addTo(map).bindPopup("${pin.link}").openPopup();`,
      )}
  
</script>
          `
        })
      } else {
        // Handle Buffer case if necessary
        return src
      }
    },
    externalResources() {
      return {
        css: ["https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"],
        js: [
          {
            src: "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js",
            loadTime: "beforeDOMReady",
            contentType: "external",
          },
        ],
      }
    },
  }
}
