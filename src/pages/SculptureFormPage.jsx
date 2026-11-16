import { Link } from 'react-router-dom'

export default function SculptureFormPage() {
  return (
    <section className="page">
      <p className="eyebrow">Create / Update</p>
      <h1 className="page-title">Sculpture form</h1>
      <p className="page-lead">
        One form will handle both creating a new sculpture and editing an
        existing one.
      </p>

      <div className="empty-card">
        <span className="empty-icon" aria-hidden="true">
          ✍️
        </span>
        <p>Under construction — part 6.</p>
      </div>

      <div className="page-actions">
        <Link className="button-ghost" to="/">
          Back to list
        </Link>
      </div>
    </section>
  )
}
