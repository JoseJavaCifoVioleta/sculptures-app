import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import MaterialBadge from '../components/MaterialBadge.jsx'
import Pagination from '../components/Pagination.jsx'
import { useSculptures } from '../SculpturesContext.jsx'
import { getWorkDetails } from '../data/editorial.js'

const PAGE_SIZE = 6

const FILTER_FIELDS = [
  {
    id: 'artist',
    label: 'Artist',
    placeholder: 'e.g. Hepworth',
    getValue: (sculpture) => sculpture.artist,
  },
  {
    id: 'name',
    label: 'Name',
    placeholder: 'e.g. Moai',
    getValue: (sculpture) => sculpture.name,
  },
  {
    id: 'year',
    label: 'Year',
    placeholder: 'e.g. 2023',
    getValue: (sculpture) => String(sculpture.year ?? ''),
  },
  {
    id: 'description',
    label: 'Description',
    placeholder: 'e.g. bronze',
    getValue: (sculpture) => sculpture.description ?? '',
  },
]

function normalize(value) {
  return value
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

// La luz sigue al cursor con dos variables CSS: sin estado de React y sin
// montar un canvas WebGL por tarjeta.
function trackPointer(event) {
  const rect = event.currentTarget.getBoundingClientRect()
  event.currentTarget.style.setProperty(
    '--pointer-x',
    `${event.clientX - rect.left}px`,
  )
  event.currentTarget.style.setProperty(
    '--pointer-y',
    `${event.clientY - rect.top}px`,
  )
}

function resetPointer(event) {
  event.currentTarget.style.removeProperty('--pointer-x')
  event.currentTarget.style.removeProperty('--pointer-y')
}

function buildArtistIndex(sculptures) {
  const byName = new Map()
  const artists = []

  sculptures.forEach((sculpture) => {
    if (!byName.has(sculpture.artist)) {
      const entry = {
        name: sculpture.artist,
        works: [],
        principal: sculpture,
      }
      byName.set(sculpture.artist, entry)
      artists.push(entry)
    }

    byName.get(sculpture.artist).works.push(sculpture)
  })

  return artists
}

export default function SculptureListPage() {
  const { sculptures, removeSculpture, resetSculptures } = useSculptures()
  const [searchParams, setSearchParams] = useSearchParams()
  const [pendingAction, setPendingAction] = useState(null)
  const [previewArtist, setPreviewArtist] = useState(null)

  const rawField = searchParams.get('field')
  const activeField =
    FILTER_FIELDS.find((option) => option.id === rawField) ?? FILTER_FIELDS[0]
  // Compatibilidad: los enlaces antiguos ?artist=colvin siguen funcionando.
  const filterQuery =
    searchParams.get('q') ??
    (rawField === null ? searchParams.get('artist') : null) ??
    ''
  const trimmedQuery = filterQuery.trim()
  const hasFilter = trimmedQuery.length > 0
  const fieldName = activeField.label.toLocaleLowerCase()
  const visibleSculptures = hasFilter
    ? sculptures.filter((sculpture) =>
        normalize(activeField.getValue(sculpture)).includes(
          normalize(trimmedQuery),
        ),
      )
    : sculptures

  const artists = buildArtistIndex(sculptures)
  const previewedArtist =
    artists.find((artist) => artist.name === previewArtist) ??
    artists[0] ??
    null

  const featured =
    sculptures.find((sculpture) => sculpture.name === 'Ultimate Form') ??
    sculptures[0] ??
    null
  const featuredDetails = featured ? getWorkDetails(featured) : null

  const viewMode = searchParams.get('view') === 'pages' ? 'pages' : 'all'
  const totalPages = Math.max(
    1,
    Math.ceil(visibleSculptures.length / PAGE_SIZE),
  )
  const requestedPage = Number(searchParams.get('page') ?? '1')
  const currentPage =
    Number.isInteger(requestedPage) && requestedPage >= 1
      ? Math.min(requestedPage, totalPages)
      : 1
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const listedSculptures =
    viewMode === 'pages'
      ? visibleSculptures.slice(pageStart, pageStart + PAGE_SIZE)
      : visibleSculptures
  const rangeStart = visibleSculptures.length === 0 ? 0 : pageStart + 1
  const rangeEnd =
    viewMode === 'pages'
      ? Math.min(pageStart + PAGE_SIZE, visibleSculptures.length)
      : visibleSculptures.length

  // Si la URL pide una página que ya no existe (por un filtro o un borrado),
  // la recoloca en la última válida para que la barra de direcciones no mienta.
  useEffect(() => {
    if (viewMode !== 'pages') return

    const rawPage = searchParams.get('page')
    if (rawPage === null || rawPage === String(currentPage)) return

    const next = new URLSearchParams(searchParams)
    if (currentPage === 1) {
      next.delete('page')
    } else {
      next.set('page', String(currentPage))
    }
    setSearchParams(next, { replace: true })
  }, [currentPage, searchParams, setSearchParams, viewMode])

  const showGrid = sculptures.length > 0 && visibleSculptures.length > 0
  const showPagination = viewMode === 'pages' && totalPages > 1

  function updateFilterQuery(value) {
    const next = new URLSearchParams(searchParams)

    // Normaliza el enlace heredado ?artist=... al nuevo ?q=...
    next.delete('artist')
    next.delete('page')

    if (value.trim()) {
      next.set('q', value)
    } else {
      next.delete('q')
    }

    if (activeField.id === 'artist') {
      next.delete('field')
    } else {
      next.set('field', activeField.id)
    }

    setSearchParams(next, { replace: true })
  }

  function changeFilterField(fieldId) {
    if (fieldId === activeField.id) return

    const next = new URLSearchParams(searchParams)
    next.delete('artist')
    next.delete('q')
    next.delete('page')

    if (fieldId === 'artist') {
      next.delete('field')
    } else {
      next.set('field', fieldId)
    }

    setSearchParams(next, { replace: true })
  }

  function clearFilter() {
    const next = new URLSearchParams(searchParams)
    next.delete('q')
    next.delete('artist')
    next.delete('page')
    setSearchParams(next, { replace: true })
  }

  function filterByArtist(name) {
    const next = new URLSearchParams(searchParams)
    next.delete('artist')
    next.delete('page')
    next.set('field', 'artist')
    next.set('q', name)
    setSearchParams(next)

    window.requestAnimationFrame(() => {
      document
        .getElementById('collection')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  function changeView(mode) {
    if (mode === viewMode) return

    const next = new URLSearchParams(searchParams)

    if (mode === 'pages') {
      next.set('view', 'pages')
      next.delete('page')
    } else {
      next.delete('view')
      next.delete('page')
    }

    setSearchParams(next)
  }

  function goToPage(page) {
    const next = new URLSearchParams(searchParams)
    next.set('view', 'pages')

    if (page === 1) {
      next.delete('page')
    } else {
      next.set('page', String(page))
    }

    setSearchParams(next)
  }

  async function confirmPendingAction() {
    if (!pendingAction) return

    try {
      if (pendingAction.type === 'delete') {
        await removeSculpture(pendingAction.sculpture.id)
      } else {
        await resetSculptures()
      }
    } catch {
      // Layout muestra el error de la acción en el banner superior.
    } finally {
      setPendingAction(null)
    }
  }

  const dialogContent =
    pendingAction?.type === 'delete'
      ? {
          title: 'Delete this work?',
          description: `“${pendingAction.sculpture.name}” by ${pendingAction.sculpture.artist} will be removed from the catalogue. This cannot be undone.`,
          confirmLabel: 'Delete work',
        }
      : {
          title: 'Restore the original catalogue?',
          description:
            'This replaces the current catalogue with the original 12 works. Any additions, edits or deletions will be lost. This cannot be undone.',
          confirmLabel: 'Restore catalogue',
        }

  return (
    <>
      <section className="hero">
        <div className="hero-kicker">
          <span>Independent sculpture index</span>
          <span>
            {sculptures.length} works · {artists.length} artists
          </span>
        </div>

        <h1 className="hero-title">Sculptures</h1>

        <div className="hero-foot">
          <p className="hero-intro">
            A considered selection of public sculpture, presented as a living
            catalogue of material, scale and place.
          </p>
          <a className="text-link" href="#artists">
            Index of artists
          </a>
        </div>

        {featured && (
          <div className="hero-feature">
            <Link
              className="hero-feature-media"
              to={`/sculptures/${featured.id}`}
              aria-label={`View ${featured.name}`}
            >
              <img
                src={featured.url}
                alt={featured.alt ?? ''}
                fetchPriority="high"
              />
            </Link>

            <div className="hero-feature-caption">
              <p className="caption-label">Featured work</p>
              <h2>{featured.name}</h2>
              <p>
                {featured.artist}
                {featured.year !== '' && featured.year != null
                  ? ` · ${featured.year}`
                  : ''}
              </p>
              <p>
                {featuredDetails.material} · {featuredDetails.dimensions}
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="artists-section" id="artists">
        <div className="section-head">
          <div>
            <p className="section-label">01 — Index</p>
            <h2 className="section-title">Artists represented</h2>
          </div>
          <p className="section-note">
            Hover to preview a principal work. Select a name to filter the
            collection.
          </p>
        </div>

        {artists.length > 0 ? (
          <div className="artists-layout">
            <ul
              className="artist-list"
              onMouseLeave={() => setPreviewArtist(null)}
            >
              {artists.map((artist, index) => (
                <li key={artist.name}>
                  <button
                    className={`artist-row${
                      previewedArtist?.name === artist.name
                        ? ' is-active'
                        : ''
                    }`}
                    type="button"
                    onMouseEnter={() => setPreviewArtist(artist.name)}
                    onFocus={() => setPreviewArtist(artist.name)}
                    onClick={() => filterByArtist(artist.name)}
                  >
                    <span className="artist-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="artist-name">{artist.name}</span>
                    <span className="artist-count">
                      {String(artist.works.length).padStart(2, '0')}
                    </span>
                    <img
                      className="artist-thumb"
                      src={artist.principal.url}
                      alt=""
                    />
                  </button>
                </li>
              ))}
            </ul>

            <aside className="artist-preview" aria-live="polite">
              {previewedArtist && (
                <>
                  <div className="artist-preview-media">
                    <img
                      key={previewedArtist.name}
                      src={previewedArtist.principal.url}
                      alt={previewedArtist.principal.alt ?? ''}
                    />
                  </div>
                  <p className="caption-label">Principal work</p>
                  <h3>{previewedArtist.principal.name}</h3>
                  <p>
                    {previewedArtist.name}
                    {previewedArtist.principal.year !== '' &&
                    previewedArtist.principal.year != null
                      ? ` · ${previewedArtist.principal.year}`
                      : ''}
                  </p>
                </>
              )}
            </aside>
          </div>
        ) : (
          <div className="empty-note">
            <h3>The index is waiting for its first artist.</h3>
            <p>
              Add a work to begin the catalogue, or restore the original
              selection.
            </p>
            <div className="empty-actions">
              <Link className="text-link" to="/sculptures/new">
                Add a work
              </Link>
              <button
                className="text-link"
                type="button"
                onClick={() => setPendingAction({ type: 'restore' })}
              >
                Restore catalogue
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="collection" id="collection">
        <div className="collection-head">
          <div>
            <p className="section-label">02 — Collection</p>
            <h2 className="section-title">Selected works</h2>
          </div>
          <div className="collection-meta">
            <p>
              {visibleSculptures.length} of {sculptures.length}{' '}
              {sculptures.length === 1 ? 'work' : 'works'}
            </p>
            <Link className="text-link" to="/sculptures/new">
              Add a work
            </Link>
          </div>
        </div>

        <div className="list-toolbar">
          <div className="filter-bar">
            <div className="filter-fields-row">
              <span className="form-label" id="filter-field-label">
                Filter by
              </span>
              <div
                className="filter-fields"
                role="group"
                aria-labelledby="filter-field-label"
              >
                {FILTER_FIELDS.map((field) => (
                  <button
                    className="filter-field"
                    key={field.id}
                    type="button"
                    aria-pressed={activeField.id === field.id}
                    onClick={() => changeFilterField(field.id)}
                  >
                    {field.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-query-row">
              <input
                className="form-input"
                id="catalogue-filter"
                type="search"
                value={filterQuery}
                onChange={(event) => updateFilterQuery(event.target.value)}
                placeholder={activeField.placeholder}
                aria-label={`Filter by ${fieldName}`}
                autoComplete="off"
              />

              {hasFilter && (
                <button
                  className="text-link"
                  type="button"
                  onClick={clearFilter}
                >
                  Clear filter
                </button>
              )}
            </div>
          </div>

          <div className="view-switch" role="group" aria-label="Layout">
            <button
              className="view-option"
              type="button"
              aria-pressed={viewMode === 'all'}
              onClick={() => changeView('all')}
            >
              All
            </button>
            <button
              className="view-option"
              type="button"
              aria-pressed={viewMode === 'pages'}
              onClick={() => changeView('pages')}
            >
              Pages
            </button>
          </div>
        </div>

        {hasFilter && sculptures.length > 0 && (
          <p className="filter-summary" role="status">
            {viewMode === 'pages'
              ? `Showing ${rangeStart}–${rangeEnd} of ${visibleSculptures.length} ${
                  visibleSculptures.length === 1 ? 'work' : 'works'
                } where ${fieldName} matches “${trimmedQuery}”.`
              : `Showing ${visibleSculptures.length} of ${sculptures.length} ${
                  sculptures.length === 1 ? 'work' : 'works'
                } where ${fieldName} matches “${trimmedQuery}”.`}
          </p>
        )}

        {!hasFilter && viewMode === 'pages' && sculptures.length > 0 && (
          <p className="filter-summary" role="status">
            Showing {rangeStart}–{rangeEnd} of {sculptures.length}{' '}
            {sculptures.length === 1 ? 'work' : 'works'}.
          </p>
        )}

        {sculptures.length === 0 && (
          <div className="empty-note">
            <h3>No works in the catalogue.</h3>
            <p>
              Add a first sculpture or restore the original selection to begin
              again.
            </p>
            <div className="empty-actions">
              <Link className="text-link" to="/sculptures/new">
                Add a work
              </Link>
              <button
                className="text-link"
                type="button"
                onClick={() => setPendingAction({ type: 'restore' })}
              >
                Restore catalogue
              </button>
            </div>
          </div>
        )}

        {sculptures.length > 0 && visibleSculptures.length === 0 && (
          <div className="empty-note">
            <h3>No works match this search.</h3>
            <p>
              Nothing in the collection matches {fieldName} “{trimmedQuery}”.
            </p>
            <div className="empty-actions">
              <button
                className="text-link"
                type="button"
                onClick={clearFilter}
              >
                Clear filter
              </button>
            </div>
          </div>
        )}

        {showGrid && (
          <ul className="sculpture-grid">
            {listedSculptures.map((sculpture, index) => {
              const details = getWorkDetails(sculpture)

              return (
                <li
                  className="sculpture-card"
                  key={sculpture.id}
                  style={{ '--card-index': String(index) }}
                >
                  <div
                    className="sculpture-visual"
                    onPointerMove={trackPointer}
                    onPointerLeave={resetPointer}
                  >
                    <Link
                      className="sculpture-media"
                      to={`/sculptures/${sculpture.id}`}
                      aria-label={`View ${sculpture.name}`}
                    >
                      <img
                        src={sculpture.url}
                        alt={sculpture.alt ?? ''}
                        loading="lazy"
                      />
                    </Link>
                    <MaterialBadge material={details.material} />
                  </div>

                  <div className="sculpture-body">
                    <div className="sculpture-meta">
                      <span>
                        {sculpture.year !== '' && sculpture.year != null
                          ? sculpture.year
                          : 'Undated'}
                      </span>
                      <span>{details.material}</span>
                    </div>

                    <h3 className="sculpture-name">
                      <Link to={`/sculptures/${sculpture.id}`}>
                        {sculpture.name}
                      </Link>
                    </h3>
                    <p className="sculpture-artist">{sculpture.artist}</p>

                    <div className="work-actions">
                      <Link to={`/sculptures/${sculpture.id}`}>
                        View work
                      </Link>
                      <Link to={`/sculptures/${sculpture.id}/edit`}>
                        Edit
                      </Link>
                      <button
                        className="text-link--danger"
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
              )
            })}
          </ul>
        )}

        {showPagination && (
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={goToPage}
          />
        )}

        <div className="archive-tools">
          <p>
            {sculptures.length} {sculptures.length === 1 ? 'entry' : 'entries'}{' '}
            in the catalogue
          </p>
          <div className="archive-tools-actions">
            <Link className="text-link" to="/sculptures/new">
              Add a work
            </Link>
            <button
              className="text-link"
              type="button"
              onClick={() => setPendingAction({ type: 'restore' })}
            >
              Restore original data
            </button>
          </div>
        </div>

        <ConfirmDialog
          open={Boolean(pendingAction)}
          title={dialogContent.title}
          description={dialogContent.description}
          confirmLabel={dialogContent.confirmLabel}
          onConfirm={confirmPendingAction}
          onCancel={() => setPendingAction(null)}
        />
      </section>
    </>
  )
}
