import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'

export default function Layout({
  sculptures,
  addSculpture,
  updateSculpture,
  deleteSculpture,
  resetSculptures,
}) {
  const { hash } = useLocation()

  useEffect(() => {
    if (!hash) return

    const target = document.getElementById(hash.slice(1))
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [hash])

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
        <Outlet
          context={{
            sculptures,
            addSculpture,
            updateSculpture,
            deleteSculpture,
            resetSculptures,
          }}
        />
      </main>

      <footer className="site-footer">
        <p>Sculptures — an independent index of public art.</p>
        <p>Catalogue data: AlbertProfe / React docs</p>
        <p>React + React Router</p>
      </footer>
    </>
  )
}
