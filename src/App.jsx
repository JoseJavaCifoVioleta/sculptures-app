import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { sculptureList } from './data.js'
import Layout from './pages/Layout.jsx'
import SculptureListPage from './pages/SculptureListPage.jsx'
import SculptureDetailPage from './pages/SculptureDetailPage.jsx'
import SculptureFormPage from './pages/SculptureFormPage.jsx'
import NoPage from './pages/NoPage.jsx'
import './App.css'

export default function App() {
  const [sculptures, setSculptures] = useState(sculptureList)

  function addSculpture(sculpture) {
    const newSculpture = { ...sculpture, id: crypto.randomUUID() }
    setSculptures((current) => [...current, newSculpture])
  }

  function updateSculpture(id, changes) {
    setSculptures((current) =>
      current.map((sculpture) =>
        String(sculpture.id) === String(id)
          ? { ...sculpture, ...changes, id: sculpture.id }
          : sculpture,
      ),
    )
  }

  function deleteSculpture(id) {
    setSculptures((current) =>
      current.filter((sculpture) => String(sculpture.id) !== String(id)),
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout
              sculptures={sculptures}
              addSculpture={addSculpture}
              updateSculpture={updateSculpture}
              deleteSculpture={deleteSculpture}
            />
          }
        >
          <Route index element={<SculptureListPage />} />
          <Route path="sculptures/:id" element={<SculptureDetailPage />} />
          <Route path="sculptures/new" element={<SculptureFormPage />} />
          <Route path="sculptures/:id/edit" element={<SculptureFormPage />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
