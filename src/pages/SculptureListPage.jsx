import { Link, useOutletContext } from 'react-router-dom'

export default function SculptureListPage() {
  const { sculptures } = useOutletContext()

  return (
    <section className="page">
      <p className="eyebrow">Public art catalogue</p>
      <h1 className="page-title">Sculptures</h1>
      <p className="page-lead">
        A small gallery of public sculptures from around the world.
      </p>

      <div className="stat-card">
        <span className="stat-value">{sculptures.length}</span>
        <span className="stat-label">sculptures in the catalogue</span>
      </div>

      <div className="page-actions">
        <Link className="button-primary" to="/sculptures/new">
          Add a sculpture
        </Link>
      </div>

      <ul className="sculpture-grid">
        {sculptures.map((sculpture) => (
          <li className="sculpture-card" key={sculpture.id}>
            <div className="sculpture-media">
              <img
                src={sculpture.url}
                alt={sculpture.alt}
                width="80"
                loading="lazy"
              />
            </div>

            <div className="sculpture-body">
              <p className="sculpture-year">{sculpture.year}</p>
              <h2 className="sculpture-name">{sculpture.name}</h2>
              <p className="sculpture-artist">{sculpture.artist}</p>

              <div className="sculpture-actions">
                <Link
                  className="button-ghost"
                  to={`/sculptures/${sculpture.id}`}
                >
                  View
                </Link>
                <Link
                  className="button-ghost"
                  to={`/sculptures/${sculpture.id}/edit`}
                >
                  Edit
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
