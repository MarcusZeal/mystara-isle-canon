import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  altText?: string
  className?: string
}

const defaultOptions: Options = {
  altText: "Zone Map",
  className: "zone-map",
}

const parseObsidianLink = (link: string): string => {
  const match = link.match(/^\[\[(.+?)\]\]$/)
  return match ? match[1] : link
}

const ZoneMap: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const zoneMap = fileData.frontmatter?.zoneMap as string | undefined
  if (!zoneMap) return null

  const resolvedZoneMap = `/includes/Maps/${parseObsidianLink(zoneMap)}`

  return (
    <a href={resolvedZoneMap} target="_blank" rel="noopener noreferrer">
      <img
        target="_blank"
        src={resolvedZoneMap}
        alt={defaultOptions.altText}
        className={defaultOptions.className}
      />
    </a>
  )
}

ZoneMap.css = `
.zone-map {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  display: block;
  margin: 0 auto;
}
`

export default (() => ZoneMap) satisfies QuartzComponentConstructor
