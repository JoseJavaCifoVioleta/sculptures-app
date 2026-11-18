import { useEffect, useRef, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'

export default function SculptureListPage() {
  const { sculptures, deleteSculpture, resetSculptures } = useOutletContext()
  const dialogRef = useRef(null)
  const [sculptureToDelete, setSculptureToDelete] = useState(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (sculptureToDelete) {
      if (!dialog.open) dialog.showModal()
      dialog.querySelector('[data-autofocus]')?.focus()
    } else if (dialog.open) {
      dialog.close()
    }
  }, [sculptureToDelete])

  function confirmDelete() {
    if (!sculptureToDelete) return
    deleteSculpture(sculptureToDelete.id)
    setSculptureToDelete(null)
  }

  function keepFocusInside(event) {
    if (event.key !== 'Tab') return

    const focusable = event.currentTarget.querySelectorAll(
      'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    )
    if (focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
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
          onClick={resetSculptures}
        >
          Restore original data
        </button>
      </div>

      <ul className="sculpture-grid">
        {sculptures.map((sculpture, index) => (
          <li
            className="sculpture-card"
            key={sculpture.id}
            style={{ '--card-index': String(index) }}
          >
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
                <button
                  className="button-ghost button-danger"
                  type="button"
                  onClick={() => setSculptureToDelete(sculpture)}
                  aria-label={`Delete ${sculpture.name}`}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="confirm-dialog"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        onClose={() => setSculptureToDelete(null)}
        onKeyDown={keepFocusInside}
      >
        {sculptureToDelete && (
          <div className="confirm-card">
            <span className="confirm-icon" aria-hidden="true">
              🗑️
            </span>
            <h2 className="confirm-title" id="delete-dialog-title">
              Delete sculpture?
            </h2>
            <p className="confirm-text" id="delete-dialog-description">
              “{sculptureToDelete.name}” by {sculptureToDelete.artist} will be
              removed from the catalogue. This cannot be undone.
            </p>
            <div className="confirm-actions">
              <button
                className="button-ghost"
                type="button"
                data-autofocus
                onClick={() => setSculptureToDelete(null)}
              >
                Cancel
              </button>
              <button
                className="button-danger-solid"
                type="button"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  )
}
