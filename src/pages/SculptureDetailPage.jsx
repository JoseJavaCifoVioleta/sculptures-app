import { Link } from 'react-router-dom'

export default function SculptureDetailPage() {
  return (
    <section className="page">
      <p className="eyebrow">Read one</p>
      <h1 className="page-title">Sculpture detail</h1>
      <p className="page-lead">
        Here you will see the photo, artist, year, location and description of a
        single sculpture.
      </p>

      <div className="empty-card">
        <span className="empty-icon" aria-hidden="true">
          🗿
        </span>
        <p>Under construction — part 5.</p>
      </div>

      <div className="page-actions">
        <Link className="button-ghost" to="/">
          Back to list
        </Link>
      </div>
    </section>
  )
}
