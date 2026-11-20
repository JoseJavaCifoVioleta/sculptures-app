import { useEffect, useId, useRef } from 'react'

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  onConfirm,
  onCancel,
}) {
  const dialogRef = useRef(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open) {
      if (!dialog.open) dialog.showModal()
      dialog.querySelector('[data-autofocus]')?.focus()
    } else if (dialog.open) {
      dialog.close()
    }
  }, [open])

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
    <dialog
      ref={dialogRef}
      className="confirm-dialog"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onClose={onCancel}
      onKeyDown={keepFocusInside}
    >
      {open && (
        <div className="confirm-card">
          <p className="section-label">Confirmation</p>
          <h2 className="confirm-title" id={titleId}>
            {title}
          </h2>
          <p className="confirm-text" id={descriptionId}>
            {description}
          </p>
          <div className="confirm-actions">
            <button
              className="button-ghost"
              type="button"
              data-autofocus
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              className="button-danger-solid"
              type="button"
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      )}
    </dialog>
  )
}
