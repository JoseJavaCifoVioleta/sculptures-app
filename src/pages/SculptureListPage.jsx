import { useEffect, useState } from 'react'
import { Link, useOutletContext, useSearchParams } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Pagination from '../components/Pagination.jsx'

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

export default function SculptureListPage() {
  const { sculptures, deleteSculpture, resetSculptures } = useOutletContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const [pendingAction, setPendingAction] = useState(null)

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
                className="button-ghost"
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
                visibleSculptures.length === 1 ? 'sculpture' : 'sculptures'
              } where ${fieldName} matches “${trimmedQuery}”.`
            : `Showing ${visibleSculptures.length} of ${sculptures.length} ${
                sculptures.length === 1 ? 'sculpture' : 'sculptures'
              } where ${fieldName} matches “${trimmedQuery}”.`}
        </p>
      )}

      {!hasFilter && viewMode === 'pages' && sculptures.length > 0 && (
        <p className="filter-summary" role="status">
          Showing {rangeStart}–{rangeEnd} of {sculptures.length}{' '}
          {sculptures.length === 1 ? 'sculpture' : 'sculptures'}.
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
          <p className="page-lead">
            No sculptures where {fieldName} matches “{trimmedQuery}”.
          </p>
          <div className="page-actions">
            <button
              className="button-ghost"
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
          {listedSculptures.map((sculpture, index) => (
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

      {showPagination && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onChange={goToPage}
        />
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
