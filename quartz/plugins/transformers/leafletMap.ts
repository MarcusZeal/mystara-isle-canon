import { QuartzTransformerPlugin } from "../types"
import visit from "unist-util-visit"
import fetch from "node-fetch"

interface Options {
  dataUrl: string
}

let mapData: any = null

async function fetchData(url: string) {
  try {
    const response = await fetch(url)
    mapData = await response.json()
  } catch (error) {
    console.error("Error fetching data.json:", error)
  }
}

export const LeafletMap: QuartzTransformerPlugin<Options> = (opts?: Options) => {
  const dataUrl = opts?.dataUrl ?? "includes/data.json"

  // Fetch data on initialization
  fetchData(dataUrl)

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

    ${mapData
      .map(
        (pin: { lat: number; lng: number; name: string }) => `
    L.marker([${pin.lat}, ${pin.lng}]).addTo(map)
      .bindPopup("${pin.name}")
      .openPopup();
    `,
      )
      .join("")}
  });
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
