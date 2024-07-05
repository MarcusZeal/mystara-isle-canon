document.addEventListener("DOMContentLoaded", function () {
  // Function to parse the leaflet code block
  function parseLeafletBlock(content) {
    const regex = /```leaflet([\s\S]*?)```/g
    let match = regex.exec(content)
    if (!match) return null

    const config = match[1]
      .trim()
      .split("\n")
      .reduce((acc, line) => {
        let [key, value] = line.split(":").map((item) => item.trim())
        if (key && value) {
          acc[key] = value
        }
        return acc
      }, {})

    return { config, fullMatch: match[0] }
  }

  // Function to initialize the map
  function initializeMap(config, mapContainerId, markers) {
    const map = L.map(mapContainerId, {
      center: [parseFloat(config.lat), parseFloat(config.long)],
      zoom: parseInt(config.defaultZoom),
      minZoom: parseInt(config.minZoom),
      maxZoom: parseInt(config.maxZoom),
      zoomDelta: parseFloat(config.zoomDelta),
      crs: L.CRS.Simple,
    })

    const bounds = [
      [0, 0],
      [parseInt(config.bounds.split(",")[2]), parseInt(config.bounds.split(",")[3])],
    ]
    const image = L.imageOverlay(config.image.replace(/\[\[|\]\]/g, ""), bounds).addTo(map)
    map.fitBounds(bounds)

    L.control.scale({ metric: true, imperial: false, maxWidth: 200 }).addTo(map)

    markers.forEach((pin) => {
      L.marker(pin.loc)
        .addTo(map)
        .bindPopup(`<b>${pin.link}</b><br>${pin.description ? pin.description : ""}`)
    })
  }

  // Main function to find the leaflet block and replace it with the map
  function replaceLeafletBlock() {
    const content = document.body.innerHTML
    const parsedBlock = parseLeafletBlock(content)

    if (parsedBlock) {
      const mapContainerId = "map_" + parsedBlock.config.id.replace(/ /g, "_")
      const mapContainer = `<div id="${mapContainerId}" style="height: ${parsedBlock.config.height}; width: ${parsedBlock.config.width};"></div>`
      document.body.innerHTML = document.body.innerHTML.replace(parsedBlock.fullMatch, mapContainer)

      fetch("data.json")
        .then((response) => response.json())
        .then((data) => {
          const mapData = data.mapMarkers.find((map) => map.id === parsedBlock.config.id)
          if (mapData) {
            initializeMap(parsedBlock.config, mapContainerId, mapData.markers)
          }
        })
        .catch((error) => console.error("Error fetching pin data:", error))
    }
  }

  replaceLeafletBlock()
})
