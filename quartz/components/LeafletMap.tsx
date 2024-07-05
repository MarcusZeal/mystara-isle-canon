import React, { useEffect } from "react"
import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface LeafletOptions {
  defaultZoom: number
  minZoom: number
  maxZoom: number
  zoomDelta: number
  bounds: string
  image: string
}

const defaultOptions: LeafletOptions = {
  defaultZoom: 5,
  minZoom: 2,
  maxZoom: 18,
  zoomDelta: 1,
  bounds: "[[0,0],[1000,1000]]",
  image: "path/to/default/image.png",
}

export default ((userOpts?: Partial<LeafletOptions>) => {
  const opts: LeafletOptions = { ...defaultOptions, ...userOpts }

  const LeafletMapComponent = (props: QuartzComponentProps) => {
    const { fileData } = props
    const shortcode = fileData?.frontmatter?.leaflet

    useEffect(() => {
      if (shortcode && typeof shortcode === "string") {
        const config = parseShortcode(shortcode)

        import("leaflet").then((L) => {
          fetch("/includes/data.json")
            .then((response) => response.json())
            .then((data) => {
              const mapData = data.mapMarkers.find((markerData: any) => markerData.id === config.id)
              if (mapData) {
                const markers = mapData.markers
                initializeMap(config, "map", markers, L)
              }
            })
            .catch((error) => console.error("Error fetching pin data:", error))
        })
      }
    }, [shortcode])

    const parseShortcode = (shortcode: string) => {
      const config: any = {}
      const lines = shortcode
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line)

      lines.forEach((line) => {
        const [key, value] = line.split(":").map((part) => part.trim())
        if (key === "bounds" || key === "image") {
          config[key] = value
        } else {
          config[key] = isNaN(Number(value)) ? value : Number(value)
        }
      })

      config.bounds = JSON.parse(config.bounds.replace(/\[\[(.*?)\]\]/g, "[$1]"))
      config.image = config.image.replace(/\[\[(.*?)\]\]/, "$1")

      return config
    }

    if (!shortcode || typeof shortcode !== "string") {
      return null
    }

    return (
      <div data-shortcode={shortcode}>
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <div id="map" style={{ height: "1000px", width: "100%" }}></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      </div>
    )
  }

  LeafletMapComponent.css = `
    #map {
      height: 100%;
      width: 100%;
    }
  `

  return LeafletMapComponent
}) satisfies QuartzComponentConstructor

const initializeMap = (config: any, mapContainerId: string, markers: any[], L: any) => {
  const map = L.map(mapContainerId, {
    center: [parseFloat(config.lat), parseFloat(config.long)],
    zoom: parseInt(config.defaultZoom),
    minZoom: parseInt(config.minZoom),
    maxZoom: parseInt(config.maxZoom),
    zoomDelta: parseFloat(config.zoomDelta),
    crs: L.CRS.Simple,
  })

  const bounds: L.LatLngBoundsExpression = [
    [0, 0],
    [parseInt(config.bounds.split(",")[2]), parseInt(config.bounds.split(",")[3])],
  ]
  const image = L.imageOverlay(config.image.replace(/\[\[|\]\]/g, ""), bounds).addTo(map)
  map.fitBounds(bounds)

  L.control.scale({ metric: true, imperial: false, maxWidth: 200 }).addTo(map)

  markers.forEach((pin: any) => {
    L.marker(pin.loc as L.LatLngExpression)
      .addTo(map)
      .bindPopup(`<b>${pin.link}</b><br>${pin.description ? pin.description : ""}`)
  })
}
