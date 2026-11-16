import { useOutletContext } from 'react-router-dom'

export default function SculptureListPage() {
  const { sculptures } = useOutletContext()

  return (
    <section>
      <h1>Sculptures</h1>
      <p>
        {sculptures.length} sculptures loaded. The list will be built in part 5.
      </p>
    </section>
  )
}
