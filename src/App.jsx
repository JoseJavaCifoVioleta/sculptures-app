import { BrowserRouter, Routes, Route } from 'react-router-dom'
import useSculptures from './hooks/useSculptures.js'
import Layout from './pages/Layout.jsx'
import SculptureListPage from './pages/SculptureListPage.jsx'
import SculptureDetailPage from './pages/SculptureDetailPage.jsx'
import SculptureFormPage from './pages/SculptureFormPage.jsx'
import SculptureGalleryPage from './pages/SculptureGalleryPage.jsx'
import NoPage from './pages/NoPage.jsx'
import './App.css'

export default function App() {
  const {
    sculptures,
    addSculpture,
    updateSculpture,
    deleteSculpture,
    resetSculptures,
  } = useSculptures()

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
              resetSculptures={resetSculptures}
            />
          }
        >
          <Route index element={<SculptureListPage />} />
          <Route path="gallery" element={<SculptureGalleryPage />} />
          <Route path="sculptures/:id" element={<SculptureDetailPage />} />
          <Route path="sculptures/new" element={<SculptureFormPage />} />
          <Route path="sculptures/:id/edit" element={<SculptureFormPage />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
