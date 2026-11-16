import { Link } from 'react-router-dom'

export default function NoPage() {
  return (
    <section className="page">
      <p className="eyebrow">404</p>
      <h1 className="page-title">This page is not in the gallery</h1>
      <p className="page-lead">
        The address you typed does not exist. Let's go back to the sculptures.
      </p>

      <div className="page-actions">
        <Link className="button-primary" to="/">
          Back to the list
        </Link>
      </div>
    </section>
  )
}
