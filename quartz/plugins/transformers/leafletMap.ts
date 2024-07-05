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
        return src.replace(/```leaflet-map([\s\S]*?)```/g, (match: string, p1: string) => {
          const mapId = `leaflet-map-${Math.random().toString(36).substr(2, 9)}`
          return `
<div id="${mapId}" style="height: 500px;"></div>
<script>
  document.addEventListener("DOMContentLoaded", function() {
    const map = L.map("${mapId}").setView([51.505, -0.09], 13);
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
