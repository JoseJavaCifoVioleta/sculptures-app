import { useState } from 'react'
import { Link, useNavigate, useOutletContext, useParams } from 'react-router-dom'

function emptyForm() {
  return {
    name: '',
    artist: '',
    year: '',
    location: '',
    url: '',
    alt: '',
    description: '',
  }
}

function formFromSculpture(sculpture) {
  return {
    name: sculpture.name,
    artist: sculpture.artist,
    year: String(sculpture.year),
    location: sculpture.location ?? '',
    url: sculpture.url,
    alt: sculpture.alt,
    description: sculpture.description,
  }
}

export default function SculptureFormPage() {
  const { id } = useParams()

  // La key obliga a reiniciar el formulario al pasar de crear a editar.
  return <SculptureForm key={id ?? 'new'} id={id} />
}

function SculptureForm({ id }) {
  const isEdit = Boolean(id)
  const { sculptures, addSculpture, updateSculpture } = useOutletContext()
  const navigate = useNavigate()

  const sculpture = isEdit
    ? sculptures.find((item) => String(item.id) === String(id))
    : null

  const [form, setForm] = useState(() =>
    sculpture ? formFromSculpture(sculpture) : emptyForm(),
  )

  if (isEdit && !sculpture) {
    return (
      <section className="page">
        <p className="eyebrow">Not found</p>
        <h1 className="page-title">Sculpture not found</h1>

        <div className="empty-card">
          <span className="empty-icon" aria-hidden="true">
            🗿
          </span>
          <p className="page-lead">
            There is no sculpture with id {id} to edit.
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

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const sculptureData = {
      name: form.name.trim(),
      artist: form.artist.trim(),
      year: Number(form.year),
      location: form.location.trim(),
      url: form.url.trim(),
      alt: form.alt.trim(),
      description: form.description.trim(),
    }

    if (isEdit) {
      updateSculpture(id, sculptureData)
    } else {
      addSculpture(sculptureData)
    }

    navigate('/')
  }

  return (
    <section className="page">
      <p className="eyebrow">{isEdit ? 'Update' : 'Create'}</p>
      <h1 className="page-title">
        {isEdit ? 'Edit sculpture' : 'New sculpture'}
      </h1>
      <p className="page-lead">
        {isEdit
          ? `Update the details of ${sculpture.name}.`
          : 'Add a new sculpture to the catalogue.'}
      </p>

      <form className="sculpture-form" onSubmit={handleSubmit}>
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
            />
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
            />
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
              value={form.year}
              onChange={handleChange}
            />
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
            />
          </div>

          <div className="form-field">
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

        <div className="page-actions form-actions">
          <button className="button-primary" type="submit">
            {isEdit ? 'Save changes' : 'Create sculpture'}
          </button>
          <Link className="button-ghost" to="/">
            Cancel
          </Link>
        </div>
      </form>
    </section>
  )
}
