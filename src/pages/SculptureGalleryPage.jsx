import { useOutletContext } from 'react-router-dom'
import SculpturesGallery from '../components/SculpturesGallery.jsx'

export default function SculptureGalleryPage() {
  const { sculptures } = useOutletContext()

  return (
    <SculpturesGallery
      sculptures={sculptures}
      caption="Highlights from the catalogue"
    />
  )
}
