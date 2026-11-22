import { lazy, Suspense, useState } from 'react'
import { Link } from 'react-router-dom'
import { getWorkDetails } from '../data/editorial.js'

// Three.js y el visor solo se descargan cuando alguien activa la vista 3D.
const GalleryViewer = lazy(() => import('../three/GalleryViewer.jsx'))

const DESCRIPTION_LIMIT = 180

const BACKGROUNDS = [
  { id: 'default', label: 'Default', className: '' },
  { id: 'sand', label: 'Sand', className: 'gallery-panel--sand' },
  { id: 'sky', label: 'Sky', className: 'gallery-panel--sky' },
  { id: 'mint', label: 'Mint', className: 'gallery-panel--mint' },
  { id: 'lilac', label: 'Lilac', className: 'gallery-panel--lilac' },
]

export default function SculpturesGallery({
  sculptures,
  caption = 'Sculptures Gallery',
}) {
  const [index, setIndex] = useState(0)
  const [likes, setLikes] = useState({})
  const [loop, setLoop] = useState(false)
  const [backgroundIndex, setBackgroundIndex] = useState(0)
  const [animate, setAnimate] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [show3d, setShow3d] = useState(false)

  if (!sculptures || sculptures.length === 0) {
    return (
      <section className="page">
        <p className="eyebrow">Gallery</p>
        <h1 className="page-title">{caption}</h1>
        <div className="empty-card">
          <p className="page-lead">
            There are no sculptures to show. Add one from the catalogue.
          </p>
          <div className="page-actions">
            <Link className="button-primary" to="/sculptures/new">
              Add a sculpture
            </Link>
          </div>
        </div>
      </section>
    )
  }

  // Si la lista cambia mientras la galería está abierta, el índice no se sale.
  const safeIndex = Math.min(index, sculptures.length - 1)
  const sculpture = sculptures[safeIndex]
  const isFirst = safeIndex === 0
  const isLast = safeIndex === sculptures.length - 1
  const isLiked = Boolean(likes[sculpture.id])
  const background = BACKGROUNDS[backgroundIndex]
  const details = getWorkDetails(sculpture)
  const description = sculpture.description ?? ''
  const needsToggle = description.length > DESCRIPTION_LIMIT
  const expanded = expandedId === sculpture.id
  const visibleDescription =
    expanded || !needsToggle
      ? description
      : `${description.slice(0, DESCRIPTION_LIMIT).trimEnd()}…`

  function goPrevious() {
    if (isFirst) {
      if (loop) setIndex(sculptures.length - 1)
      return
    }
    setIndex(safeIndex - 1)
  }

  function goNext() {
    if (isLast) {
      if (loop) setIndex(0)
      return
    }
    setIndex(safeIndex + 1)
  }

  function toggleLike() {
    setLikes((current) => ({
      ...current,
      [sculpture.id]: !current[sculpture.id],
    }))
  }

  function cycleBackground() {
    setBackgroundIndex((current) => (current + 1) % BACKGROUNDS.length)
  }

  function toggleExpanded() {
    setExpandedId((current) =>
      current === sculpture.id ? null : sculpture.id,
    )
  }

  return (
    <section className="page">
      <p className="eyebrow">Gallery</p>
      <h1 className="page-title">{caption}</h1>
      <p className="page-lead">
        Browse the catalogue one sculpture at a time. Use Previous and Next,
        jump with a thumbnail, or turn on Loop to wrap around the ends.
      </p>

      <div className={`gallery-panel ${background.className}`.trim()}>
        <div className="gallery-toolbar">
          <div className="gallery-nav">
            <button
              className="button-ghost"
              type="button"
              onClick={goPrevious}
              disabled={!loop && isFirst}
            >
              Previous
            </button>

            <p className="gallery-counter" aria-live="polite">
              {safeIndex + 1} of {sculptures.length}
            </p>

            <button
              className="button-ghost"
              type="button"
              onClick={goNext}
              disabled={!loop && isLast}
            >
              Next
            </button>
          </div>

          <div className="gallery-toggles">
            <label className="check-control">
              <input
                type="checkbox"
                checked={loop}
                onChange={(event) => setLoop(event.target.checked)}
              />
              Loop
            </label>

            <label className="check-control">
              <input
                type="checkbox"
                checked={animate}
                onChange={(event) => setAnimate(event.target.checked)}
              />
              Animate image
            </label>

            <label className="check-control check-control--3d">
              <input
                type="checkbox"
                checked={show3d}
                onChange={(event) => setShow3d(event.target.checked)}
              />
              3D view
            </label>

            <button
              className="button-ghost"
              type="button"
              onClick={cycleBackground}
            >
              Background: {background.label}
            </button>
          </div>
        </div>

        <div className="gallery-stage">
          <div
            className={`gallery-media${show3d ? ' gallery-media--3d' : ''}`}
          >
            {show3d ? (
              <Suspense
                fallback={
                  <p className="gallery-3d-fallback">
                    Preparing the 3D material study…
                  </p>
                }
              >
                <GalleryViewer
                  sculpture={sculpture}
                  material={details.material}
                  dimensions={details.dimensions}
                />
              </Suspense>
            ) : (
              <img
                key={sculpture.id}
                className={
                  animate
                    ? 'gallery-image gallery-image--animated'
                    : 'gallery-image'
                }
                src={sculpture.url}
                alt={sculpture.alt ?? ''}
              />
            )}
          </div>

          <div className="gallery-info">
            {sculpture.year !== '' && sculpture.year != null && (
              <p className="gallery-year">{sculpture.year}</p>
            )}

            <p className="gallery-material">
              {details.material} · {details.dimensions}
            </p>

            <h2 className="gallery-title">
              <i>{sculpture.name}</i> by {sculpture.artist}
            </h2>

            <p className="gallery-description">{visibleDescription}</p>

            {needsToggle && (
              <button
                className="button-ghost gallery-more"
                type="button"
                onClick={toggleExpanded}
              >
                {expanded ? 'Show less' : 'Show more'}
              </button>
            )}

            <div className="gallery-like-row">
              <button
                className="button-ghost gallery-like"
                type="button"
                aria-pressed={isLiked}
                onClick={toggleLike}
              >
                {isLiked ? 'Unlike' : 'Like'}
              </button>

              <p className="gallery-like-state" aria-live="polite">
                {isLiked ? 'You like this sculpture' : 'Not liked yet'}
              </p>
            </div>
          </div>
        </div>

        <div
          className="gallery-thumbs"
          role="group"
          aria-label="Choose a sculpture"
        >
          {sculptures.map((item, itemIndex) => {
            const itemLiked = Boolean(likes[item.id])

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(itemIndex)}
                aria-current={
                  itemIndex === safeIndex ? 'true' : undefined
                }
                aria-label={`Show ${item.name}${
                  itemLiked ? ' (liked)' : ''
                }`}
                title={item.name}
              >
                <img src={item.url} alt="" />
                {itemLiked && (
                  <span className="gallery-thumb-like" aria-hidden="true" />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
