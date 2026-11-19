import { Link, NavLink, Outlet } from 'react-router-dom'

export default function Layout({
  sculptures,
  addSculpture,
  updateSculpture,
  deleteSculpture,
  resetSculptures,
}) {
  return (
    <>
      <nav className="topbar">
        <Link to="/" className="brand">
          <span className="brand-mark" aria-hidden="true">
            S
          </span>
          <span>Sculptures</span>
        </Link>

        <div className="nav-links">
          <NavLink to="/" end>
            List
          </NavLink>
          <NavLink to="/gallery">Gallery</NavLink>
          <NavLink to="/sculptures/new">Add</NavLink>
        </div>
      </nav>

      <main>
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

      <footer className="footer">
        <span>React + React Router practice</span>
        <span>Data from AlbertProfe/sculptures</span>
      </footer>
    </>
  )
}
