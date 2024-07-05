import React, { useEffect } from "react"
import L from "leaflet"

export const parseLeafletBlock = (content: string) => {
  const regex = /```leaflet([\s\S]*?)```/g
  const match = regex.exec(content)
  if (!match) return null

  const config = match[1]
    .trim()
    .split("\n")
    .reduce((acc: { [key: string]: string }, line: string) => {
      let [key, value] = line.split(":").map((item) => item.trim())
      if (key && value) {
        acc[key] = value
      }
      return acc
    }, {})

  return { config, fullMatch: match[0] }
}

export const initializeMap = (config: any, mapContainerId: string, markers: any[]) => {
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

  markers.forEach((pin) => {
    L.marker(pin.loc as L.LatLngExpression)
      .addTo(map)
      .bindPopup(`<b>${pin.link}</b><br>${pin.description ? pin.description : ""}`)
  })
}

export const replaceLeafletBlock = () => {
  const content = document.body.innerHTML
  const parsedBlock = parseLeafletBlock(content)

  if (parsedBlock) {
    const mapContainerId = "map_" + parsedBlock.config.id.replace(/ /g, "_")
    const mapContainer = `<div id="${mapContainerId}" style="height: ${parsedBlock.config.height}; width: ${parsedBlock.config.width};"></div>`
    document.body.innerHTML = document.body.innerHTML.replace(parsedBlock.fullMatch, mapContainer)

    fetch("/includes/data.json")
      .then((response) => response.json())
      .then((data) => {
        const mapData = data.mapMarkers.find((map: any) => map.id === parsedBlock.config.id)
        if (mapData) {
          initializeMap(parsedBlock.config, mapContainerId, mapData.markers)
        }
      })
      .catch((error) => console.error("Error fetching pin data:", error))
  }
}

const LeafletMap: React.FC = () => {
  useEffect(() => {
    replaceLeafletBlock()
  }, [])

  return null
}

export default LeafletMap
