import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { useSculptures } from '../SculpturesContext.jsx'
import { getArtistProfile, getWorkDetails } from '../data/editorial.js'

export default function SculptureDetailPage() {
  const { id } = useParams()
  const { sculptures, removeSculpture } = useSculptures()
  const navigate = useNavigate()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const sculpture = sculptures.find(
    (item) => String(item.id) === String(id),
  )

  if (!sculpture) {
    return (
      <section className="notice-page">
        <p className="section-label">Not in the index</p>
        <h1 className="notice-title">This work could not be found.</h1>
        <p className="notice-text">
          There is no sculpture with the reference {id} in the catalogue.
        </p>
        <Link className="text-link" to="/">
          Return to the index
        </Link>
      </section>
    )
  }

  const workIndex = sculptures.findIndex(
    (item) => String(item.id) === String(sculpture.id),
  )
  const workNumber = String(workIndex + 1).padStart(2, '0')
  const details = getWorkDetails(sculpture)
  const artist = getArtistProfile(sculpture.artist)
  const subject = encodeURIComponent(
    `Availability — ${sculpture.name} by ${sculpture.artist}`,
  )
  const body = encodeURIComponent(
    `I would like to enquire about the availability of “${sculpture.name}” by ${sculpture.artist} (${details.dimensions}).\n\nName:\nInstitution:\nMessage:`,
  )

  async function handleDelete() {
    try {
      await removeSculpture(sculpture.id)
      setConfirmOpen(false)
      navigate('/')
    } catch {
      setConfirmOpen(false)
      // Layout muestra el error de la acción en el banner superior.
    }
  }

  return (
    <article className="detail-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Index</Link>
        <span aria-hidden="true">/</span>
        <Link to="/#collection">Collection</Link>
        <span aria-hidden="true">/</span>
        <span>Work {workNumber}</span>
      </nav>

      <header className="detail-head">
        <p className="section-label">
          Work {workNumber} / {String(sculptures.length).padStart(2, '0')}
        </p>
        <h1 className="detail-title">{sculpture.name}</h1>
        <p className="detail-artist">
          {sculpture.artist}
          {sculpture.year !== '' && sculpture.year != null
            ? `, ${sculpture.year}`
            : ''}
        </p>
      </header>

      <div className="detail-layout">
        <figure className="detail-media">
          <img src={sculpture.url} alt={sculpture.alt ?? ''} />
        </figure>

        <aside className="detail-body">
          <p className="detail-description">{sculpture.description ?? ''}</p>

          <dl className="detail-meta">
            <div>
              <dt>Artist</dt>
              <dd>{sculpture.artist}</dd>
            </div>
            {sculpture.year !== '' && sculpture.year != null && (
              <div>
                <dt>Year</dt>
                <dd>{sculpture.year}</dd>
              </div>
            )}
            <div>
              <dt>Material</dt>
              <dd>{details.material}</dd>
            </div>
            <div>
              <dt>Dimensions</dt>
              <dd>{details.dimensions}</dd>
            </div>
            {sculpture.location && (
              <div>
                <dt>Location</dt>
                <dd>{sculpture.location}</dd>
              </div>
            )}
            <div>
              <dt>Status</dt>
              <dd>{details.status}</dd>
            </div>
            <div>
              <dt>Edition</dt>
              <dd>{details.credit}</dd>
            </div>
          </dl>

          <a className="availability" href={`mailto:adquisiciones@sculptures.gallery?subject=${subject}&body=${body}`}>
            Consultar disponibilidad / Adquirir
          </a>
          <p className="availability-note">
            Institutional and private enquiries. Response within two working
            days.
          </p>

          <section className="artist-bio">
            <p className="section-label">The artist</p>
            <h2>{sculpture.artist}</h2>
            <p className="artist-bio-meta">
              {artist.origin} · {artist.years}
            </p>
            <p>{artist.bio}</p>
          </section>

          <div className="detail-actions">
            <Link className="text-link" to="/#collection">
              Back to collection
            </Link>
            <Link
              className="text-link"
              to={`/sculptures/${sculpture.id}/edit`}
            >
              Edit work
            </Link>
            <button
              className="text-link text-link--danger"
              type="button"
              onClick={() => setConfirmOpen(true)}
              aria-label={`Delete ${sculpture.name}`}
            >
              Delete work
            </button>
          </div>
        </aside>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this work?"
        description={`“${sculpture.name}” by ${sculpture.artist} will be removed from the catalogue. This cannot be undone.`}
        confirmLabel="Delete work"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </article>
  )
}
