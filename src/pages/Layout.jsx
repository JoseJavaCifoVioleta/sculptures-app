import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useSculptures } from '../SculpturesContext.jsx'

export default function Layout() {
  const { hash } = useLocation()
  const {
    loading,
    error,
    reload,
    actionError,
    clearActionError,
  } = useSculptures()

  useEffect(() => {
    if (!hash || loading) return

    const target = document.getElementById(hash.slice(1))
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash, loading])

  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand" aria-label="Sculptures, home">
          <span className="brand-name">Sculptures</span>
          <span className="brand-note">A contemporary index</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/" end>
            Index
          </NavLink>
          <Link to="/#artists">Artists</Link>
          <NavLink to="/gallery">Gallery</NavLink>
          <NavLink to="/sculptures/new">Add work</NavLink>
        </nav>

        <p className="header-meta">
          London
          <br />
          Vol. 01 — 2026
        </p>
      </header>

      <main className="site-main">
        {actionError && (
          <div className="data-banner" role="alert">
            <p>{actionError}</p>
            <button
              className="text-link"
              type="button"
              onClick={clearActionError}
            >
              Dismiss
            </button>
          </div>
        )}

        {loading ? (
          <section className="notice-page" aria-live="polite">
            <p className="section-label">Catalogue</p>
            <h1 className="notice-title">Reading the collection…</h1>
            <p className="notice-text">
              Loading works and artists from Neon.
            </p>
          </section>
        ) : error ? (
          <section className="notice-page">
            <p className="section-label">Connection</p>
            <h1 className="notice-title">
              The catalogue could not be loaded.
            </h1>
            <p className="notice-text">{error}</p>
            <p className="notice-text">
              Check that the table and the anonymous permissions exist in
              Neon, then try again.
            </p>
            <button className="text-link" type="button" onClick={reload}>
              Try again
            </button>
          </section>
        ) : (
          <Outlet />
        )}
      </main>

      <footer className="site-footer">
        <p>Sculptures — an independent index of public art.</p>
        <p>Catalogue data: AlbertProfe / React docs</p>
        <p>React + React Router + Neon</p>
      </footer>
    </>
  )
}
