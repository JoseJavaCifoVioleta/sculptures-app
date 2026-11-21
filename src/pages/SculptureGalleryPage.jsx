import SculpturesGallery from '../components/SculpturesGallery.jsx'
import { useSculptures } from '../SculpturesContext.jsx'

export default function SculptureGalleryPage() {
  const { sculptures } = useSculptures()

  return (
    <SculpturesGallery
      sculptures={sculptures}
      caption="Highlights from the catalogue"
    />
  )
}
