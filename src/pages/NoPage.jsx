import { Link } from 'react-router-dom'

export default function NoPage() {
  return (
    <section className="notice-page">
      <p className="section-label">404 — Not in the index</p>
      <h1 className="notice-title">This page is not part of the collection.</h1>
      <p className="notice-text">
        The address you typed does not exist. Return to the index to continue
        through the catalogue.
      </p>
      <Link className="text-link" to="/">
        Back to the index
      </Link>
    </section>
  )
}
