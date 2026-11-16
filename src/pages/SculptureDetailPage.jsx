import { Link, useOutletContext, useParams } from 'react-router-dom'

export default function SculptureDetailPage() {
  const { id } = useParams()
  const { sculptures } = useOutletContext()

  const sculpture = sculptures.find(
    (item) => String(item.id) === String(id),
  )

  if (!sculpture) {
    return (
      <section className="page">
        <p className="eyebrow">Not found</p>
        <h1 className="page-title">Sculpture not found</h1>
        <div className="empty-card">
          <span className="empty-icon" aria-hidden="true">
            🗿
          </span>
          <p className="page-lead">
            There is no sculpture with id {id} in the catalogue.
          </p>

          <div className="page-actions">
            <Link className="button-ghost" to="/">
              Back to list
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="page">
      <p className="eyebrow">Sculpture</p>
      <h1 className="page-title">{sculpture.name}</h1>

      <div className="detail-layout">
        <div className="detail-media">
          <img src={sculpture.url} alt={sculpture.alt} width="400" />
        </div>

        <div className="detail-body">
          <p className="page-lead">{sculpture.description}</p>

          <dl className="detail-meta">
            <div>
              <dt>Artist</dt>
              <dd>{sculpture.artist}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{sculpture.year}</dd>
            </div>
            {sculpture.location && (
              <div>
                <dt>Location</dt>
                <dd>{sculpture.location}</dd>
              </div>
            )}
          </dl>

          <div className="page-actions detail-actions">
            <Link className="button-ghost" to="/">
              Back to list
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
