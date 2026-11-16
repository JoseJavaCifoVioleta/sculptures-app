import { NavLink, Outlet } from 'react-router-dom'

export default function Layout({
  sculptures,
  addSculpture,
  updateSculpture,
  deleteSculpture,
}) {
  return (
    <>
      <nav className="topbar">
        <NavLink to="/" end>
          List
        </NavLink>
        <NavLink to="/sculptures/new">Add</NavLink>
      </nav>

      <main>
        <Outlet
          context={{
            sculptures,
            addSculpture,
            updateSculpture,
            deleteSculpture,
          }}
        />
      </main>
    </>
  )
}
