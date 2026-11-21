import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSculptures } from '../SculpturesContext.jsx'

function emptyForm() {
  return {
    name: '',
    artist: '',
    year: '',
    location: '',
    material: '',
    dimensions: '',
    url: '',
    alt: '',
    description: '',
  }
}

function formFromSculpture(sculpture) {
  return {
    name: sculpture.name,
    artist: sculpture.artist,
    year: sculpture.year == null ? '' : String(sculpture.year),
    location: sculpture.location ?? '',
    material: sculpture.material ?? '',
    dimensions: sculpture.dimensions ?? '',
    url: sculpture.url,
    alt: sculpture.alt ?? '',
    description: sculpture.description ?? '',
  }
}

const FIELD_ORDER = ['name', 'artist', 'url', 'year']

function validate(values) {
  const nextErrors = {}

  if (!values.name.trim()) {
    nextErrors.name = 'Name is required.'
  }

  if (!values.artist.trim()) {
    nextErrors.artist = 'Artist is required.'
  }

  const url = values.url.trim()
  if (!url) {
    nextErrors.url = 'Image URL is required.'
  } else {
    try {
      const parsed = new URL(url)
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        nextErrors.url = 'Use an http:// or https:// URL.'
      }
    } catch {
      nextErrors.url =
        'Enter a valid URL, for example https://example.com/image.jpg.'
    }
  }

  const year = values.year.trim()
  if (year && (!/^\d{1,4}$/.test(year) || Number(year) > 3000)) {
    nextErrors.year = 'Enter a whole year between 0 and 3000.'
  }

  return nextErrors
}

export default function SculptureFormPage() {
  const { id } = useParams()

  // La key obliga a reiniciar el formulario al pasar de crear a editar.
  return <SculptureForm key={id ?? 'new'} id={id} />
}

function SculptureForm({ id }) {
  const isEdit = Boolean(id)
  const { sculptures, addSculpture, updateSculpture } = useSculptures()
  const navigate = useNavigate()

  const sculpture = isEdit
    ? sculptures.find((item) => String(item.id) === String(id))
    : null

  const [form, setForm] = useState(() =>
    sculpture ? formFromSculpture(sculpture) : emptyForm(),
  )
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  if (isEdit && !sculpture) {
    return (
      <section className="notice-page">
        <p className="section-label">Not in the index</p>
        <h1 className="notice-title">This work could not be edited.</h1>
        <p className="notice-text">
          There is no sculpture with the reference {id} in the catalogue.
        </p>
        <Link className="text-link" to="/">
          Return to the index
        </Link>
      </section>
    )
  }

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))

    setErrors((current) => {
      if (!current[name]) return current

      const next = { ...current }
      delete next[name]
      return next
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const values = {
      name: form.name.trim(),
      artist: form.artist.trim(),
      year: form.year.trim(),
      location: form.location.trim(),
      material: form.material.trim(),
      dimensions: form.dimensions.trim(),
      url: form.url.trim(),
      alt: form.alt.trim(),
      description: form.description.trim(),
    }

    const nextErrors = validate(values)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)

      const firstError = FIELD_ORDER.find((field) => nextErrors[field])
      event.currentTarget.elements.namedItem(firstError)?.focus()
      return
    }

    setErrors({})
    setSubmitting(true)

    const sculptureData = {
      ...values,
      year: values.year === '' ? null : Number(values.year),
    }

    try {
      if (isEdit) {
        await updateSculpture(id, sculptureData)
      } else {
        await addSculpture(sculptureData)
      }

      navigate('/')
    } catch {
      // Layout muestra el error de la acción en el banner superior.
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="form-page">
      <p className="section-label">{isEdit ? 'Edit entry' : 'New entry'}</p>
      <h1 className="form-title">
        {isEdit ? 'Edit work' : 'Add a work'}
      </h1>
      <p className="form-intro">
        {isEdit
          ? `Update the catalogue record for ${sculpture.name}.`
          : 'Add a sculpture to the index. Material and dimensions are optional, but they complete the museum record.'}
      </p>

      <form
        className="sculpture-form"
        onSubmit={handleSubmit}
        noValidate
        aria-busy={submitting}
      >
        {Object.keys(errors).length > 0 && (
          <p className="form-alert" role="alert">
            Please fix the highlighted fields before saving.
          </p>
        )}

        <div className="form-grid">
          <div className="form-field">
            <label className="form-label" htmlFor="name">
              Name
            </label>
            <input
              className="form-input"
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              aria-invalid={errors.name ? 'true' : undefined}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p className="form-error" id="name-error">
                {errors.name}
              </p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="artist">
              Artist
            </label>
            <input
              className="form-input"
              id="artist"
              name="artist"
              type="text"
              value={form.artist}
              onChange={handleChange}
              required
              aria-invalid={errors.artist ? 'true' : undefined}
              aria-describedby={errors.artist ? 'artist-error' : undefined}
            />
            {errors.artist && (
              <p className="form-error" id="artist-error">
                {errors.artist}
              </p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="year">
              Year
            </label>
            <input
              className="form-input"
              id="year"
              name="year"
              type="number"
              min="0"
              max="3000"
              step="1"
              value={form.year}
              onChange={handleChange}
              aria-invalid={errors.year ? 'true' : undefined}
              aria-describedby={errors.year ? 'year-error' : undefined}
            />
            {errors.year && (
              <p className="form-error" id="year-error">
                {errors.year}
              </p>
            )}
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="location">
              Location
            </label>
            <input
              className="form-input"
              id="location"
              name="location"
              type="text"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="material">
              Material
            </label>
            <input
              className="form-input"
              id="material"
              name="material"
              type="text"
              value={form.material}
              onChange={handleChange}
              placeholder="e.g. Bronze"
            />
          </div>

          <div className="form-field">
            <label className="form-label" htmlFor="dimensions">
              Dimensions
            </label>
            <input
              className="form-input"
              id="dimensions"
              name="dimensions"
              type="text"
              value={form.dimensions}
              onChange={handleChange}
              placeholder="e.g. 290 × 110 × 90 cm"
            />
          </div>

          <div className="form-field form-field-wide">
            <label className="form-label" htmlFor="url">
              Image URL
            </label>
            <input
              className="form-input"
              id="url"
              name="url"
              type="url"
              value={form.url}
              onChange={handleChange}
              required
              aria-invalid={errors.url ? 'true' : undefined}
              aria-describedby={errors.url ? 'url-error' : undefined}
            />
            {errors.url && (
              <p className="form-error" id="url-error">
                {errors.url}
              </p>
            )}
          </div>

          <div className="form-field form-field-wide">
            <label className="form-label" htmlFor="alt">
              Image description
            </label>
            <input
              className="form-input"
              id="alt"
              name="alt"
              type="text"
              value={form.alt}
              onChange={handleChange}
            />
          </div>

          <div className="form-field form-field-wide">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea
              className="form-input form-textarea"
              id="description"
              name="description"
              rows="6"
              value={form.description}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            className="button-primary"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? 'Saving…'
              : isEdit
                ? 'Save changes'
                : 'Add to catalogue'}
          </button>
          <Link className="text-link" to="/">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  )
}
