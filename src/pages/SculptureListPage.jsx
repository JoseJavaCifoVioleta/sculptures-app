import { useState } from 'react'
import { Link, useOutletContext, useSearchParams } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

function normalize(value) {
  return value
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export default function SculptureListPage() {
  const { sculptures, deleteSculpture, resetSculptures } = useOutletContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const [pendingAction, setPendingAction] = useState(null)

  const artistFilter = searchParams.get('artist') ?? ''
  const trimmedFilter = artistFilter.trim()
  const hasFilter = trimmedFilter.length > 0
  const visibleSculptures = hasFilter
    ? sculptures.filter((sculpture) =>
        normalize(sculpture.artist).includes(normalize(trimmedFilter)),
      )
    : sculptures

  const showGrid = sculptures.length > 0 && visibleSculptures.length > 0

  function updateArtistFilter(value) {
    const next = new URLSearchParams(searchParams)

    if (value.trim()) {
      next.set('artist', value)
    } else {
      next.delete('artist')
    }

    setSearchParams(next, { replace: true })
  }

  function clearArtistFilter() {
    const next = new URLSearchParams(searchParams)
    next.delete('artist')
    setSearchParams(next, { replace: true })
  }

  function confirmPendingAction() {
    if (!pendingAction) return

    if (pendingAction.type === 'delete') {
      deleteSculpture(pendingAction.sculpture.id)
    } else {
      resetSculptures()
    }

    setPendingAction(null)
  }

  const dialogContent =
    pendingAction?.type === 'delete'
      ? {
          icon: '🗑️',
          title: 'Delete sculpture?',
          description: `“${pendingAction.sculpture.name}” by ${pendingAction.sculpture.artist} will be removed from the catalogue. This cannot be undone.`,
          confirmLabel: 'Delete',
        }
      : {
          icon: '↺',
          title: 'Restore original data?',
          description:
            'This will replace the current catalogue with the original sculptures from data.js. Any additions, edits or deletions you made will be lost. This cannot be undone.',
          confirmLabel: 'Restore data',
        }

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
        <button
          className="button-ghost"
          type="button"
          onClick={() => setPendingAction({ type: 'restore' })}
        >
          Restore original data
        </button>
      </div>

      <div className="filter-bar">
        <div className="form-field">
          <label className="form-label" htmlFor="artist-filter">
            Filter by artist
          </label>
          <input
            className="form-input"
            id="artist-filter"
            name="artist"
            type="search"
            value={artistFilter}
            onChange={(event) => updateArtistFilter(event.target.value)}
            placeholder="e.g. Hepworth"
            autoComplete="off"
          />
        </div>

        {hasFilter && (
          <button
            className="button-ghost"
            type="button"
            onClick={clearArtistFilter}
          >
            Clear filter
          </button>
        )}
      </div>

      {hasFilter && sculptures.length > 0 && (
        <p className="filter-summary" role="status">
          Showing {visibleSculptures.length} of {sculptures.length}{' '}
          {sculptures.length === 1 ? 'sculpture' : 'sculptures'} matching “{trimmedFilter}”.
        </p>
      )}

      {sculptures.length === 0 && (
        <div className="empty-card list-empty">
          <span className="empty-icon" aria-hidden="true">
            🗿
          </span>
          <p className="page-lead">
            The catalogue is empty. Use “Add a sculpture” or “Restore original
            data” to start again.
          </p>
        </div>
      )}

      {sculptures.length > 0 && visibleSculptures.length === 0 && (
        <div className="empty-card list-empty">
          <span className="empty-icon" aria-hidden="true">
            🔍
          </span>
          <p className="page-lead">No sculptures match “{trimmedFilter}”.</p>
          <div className="page-actions">
            <button
              className="button-ghost"
              type="button"
              onClick={clearArtistFilter}
            >
              Clear filter
            </button>
          </div>
        </div>
      )}

      {showGrid && (
        <ul className="sculpture-grid">
          {visibleSculptures.map((sculpture, index) => (
            <li
              className="sculpture-card"
              key={sculpture.id}
              style={{ '--card-index': String(index) }}
            >
              <div className="sculpture-media">
                <img
                  src={sculpture.url}
                  alt={sculpture.alt ?? ''}
                  width="80"
                  loading="lazy"
                />
              </div>

              <div className="sculpture-body">
                {sculpture.year !== '' && sculpture.year != null && (
                  <p className="sculpture-year">{sculpture.year}</p>
                )}
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
                  <button
                    className="button-ghost button-danger"
                    type="button"
                    onClick={() =>
                      setPendingAction({ type: 'delete', sculpture })
                    }
                    aria-label={`Delete ${sculpture.name}`}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={Boolean(pendingAction)}
        icon={dialogContent.icon}
        title={dialogContent.title}
        description={dialogContent.description}
        confirmLabel={dialogContent.confirmLabel}
        onConfirm={confirmPendingAction}
        onCancel={() => setPendingAction(null)}
      />
    </section>
  )
}
