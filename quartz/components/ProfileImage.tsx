import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  altText?: string
  className?: string
}

const defaultOptions: Options = {
  altText: "Profile Image",
  className: "profile-image",
}

const parseObsidianLink = (link: string): string => {
  const match = link.match(/^\[\[(.+?)\]\]$/)
  return match ? match[1] : link
}

const ProfileImage: QuartzComponent = ({ fileData, siteData }: QuartzComponentProps) => {
  const profileImage = fileData.frontmatter?.profile as string | undefined
  if (!profileImage) return null

  const resolvedProfileImage = `https://marcuszeal.github.io/mystara-isle-canon/includes/People/${parseObsidianLink(profileImage)}`

  return (
    <img
      src={resolvedProfileImage}
      alt={defaultOptions.altText}
      className={defaultOptions.className}
    />
  )
}

ProfileImage.css = `
.profile-image {
  max-width: 100%;
  height: auto;
  border-radius: 50%;
  display: block;
  margin: 0 auto;
}
`

export default (() => ProfileImage) satisfies QuartzComponentConstructor
