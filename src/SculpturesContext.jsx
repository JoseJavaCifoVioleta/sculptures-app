// Contexto y hook del catálogo, siguiendo la guía del wiki:
// un solo archivo, estado compartido y solo dos exports públicos.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { sculptureList } from './data.js'
import { getWorkDetails } from './data/editorial.js'
import { neon, neonConfigError } from './neon.js'

const SculpturesContext = createContext(null)

function client() {
  if (!neon) throw new Error(neonConfigError)
  return neon
}

function unwrap({ data, error }) {
  if (error) {
    const message = [error.message, error.hint].filter(Boolean).join(' ')
    const wrapped = new Error(message || 'The database request failed.')
    wrapped.code = error.code
    throw wrapped
  }

  return data
}

function toRow(sculpture) {
  return {
    name: sculpture.name.trim(),
    artist: sculpture.artist.trim(),
    description: sculpture.description?.trim() ?? '',
    year:
      sculpture.year === '' || sculpture.year == null
        ? null
        : Number(sculpture.year),
    location: sculpture.location?.trim() || null,
    url: sculpture.url.trim(),
    alt: sculpture.alt?.trim() ?? '',
    material: sculpture.material?.trim() || null,
    dimensions: sculpture.dimensions?.trim() || null,
  }
}

function seedRows() {
  return sculptureList.map((sculpture) => {
    const details = getWorkDetails(sculpture)

    return toRow({
      ...sculpture,
      material: sculpture.material ?? details.material,
      dimensions: sculpture.dimensions ?? details.dimensions,
    })
  })
}

const SculptureApiService = {
  async getAll() {
    return unwrap(
      await client()
        .from('sculptures')
        .select('*')
        .order('id', { ascending: true }),
    )
  },

  async create(sculpture) {
    const rows = unwrap(
      await client().from('sculptures').insert(toRow(sculpture)).select(),
    )

    if (!rows?.[0]) throw new Error('The work could not be created.')
    return rows[0]
  },

  async update(id, sculpture) {
    const rows = unwrap(
      await client()
        .from('sculptures')
        .update({
          ...toRow(sculpture),
          updated_at: new Date().toISOString(),
        })
        .eq('id', Number(id))
        .select(),
    )

    if (!rows?.[0]) throw new Error('The work could not be updated.')
    return rows[0]
  },

  async remove(id) {
    unwrap(
      await client().from('sculptures').delete().eq('id', Number(id)),
    )
  },

  async reset() {
    unwrap(await client().from('sculptures').delete().gte('id', 0))

    const rows = unwrap(
      await client().from('sculptures').insert(seedRows()).select(),
    )

    return rows ?? []
  },
}

export function SculpturesProvider({ children }) {
  const [sculptures, setSculptures] = useState([])
  const [loading, setLoading] = useState(!neonConfigError)
  const [error, setError] = useState(neonConfigError)
  const [actionError, setActionError] = useState(null)
  const [reloadToken, setReloadToken] = useState(0)

  useEffect(() => {
    if (!neon) return undefined

    let cancelled = false

    async function fetchSculptures() {
      try {
        const rows = await SculptureApiService.getAll()

        if (!cancelled) {
          setSculptures(rows)
          setError(null)
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError.message)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchSculptures()

    return () => {
      cancelled = true
    }
  }, [reloadToken])

  const reload = useCallback(() => {
    if (!neon) return

    setLoading(true)
    setError(null)
    setReloadToken((token) => token + 1)
  }, [])

  const runAction = useCallback(async (action) => {
    setActionError(null)

    try {
      return await action()
    } catch (actionFailure) {
      setActionError(actionFailure.message)
      throw actionFailure
    }
  }, [])

  const addSculpture = useCallback(
    async (data) => {
      const row = await runAction(() => SculptureApiService.create(data))
      setSculptures((current) => [...current, row])
      return row
    },
    [runAction],
  )

  const updateSculpture = useCallback(
    async (id, data) => {
      const row = await runAction(() => SculptureApiService.update(id, data))
      setSculptures((current) =>
        current.map((sculpture) =>
          String(sculpture.id) === String(id) ? row : sculpture,
        ),
      )
      return row
    },
    [runAction],
  )

  const removeSculpture = useCallback(
    async (id) => {
      await runAction(() => SculptureApiService.remove(id))
      setSculptures((current) =>
        current.filter((sculpture) => String(sculpture.id) !== String(id)),
      )
    },
    [runAction],
  )

  const resetSculptures = useCallback(async () => {
    const rows = await runAction(() => SculptureApiService.reset())
    setSculptures(rows)
  }, [runAction])

  const clearActionError = useCallback(() => {
    setActionError(null)
  }, [])

  const value = useMemo(
    () => ({
      sculptures,
      loading,
      error,
      actionError,
      reload,
      clearActionError,
      addSculpture,
      updateSculpture,
      removeSculpture,
      resetSculptures,
    }),
    [
      sculptures,
      loading,
      error,
      actionError,
      reload,
      clearActionError,
      addSculpture,
      updateSculpture,
      removeSculpture,
      resetSculptures,
    ],
  )

  return (
    <SculpturesContext.Provider value={value}>
      {children}
    </SculpturesContext.Provider>
  )
}

export function useSculptures() {
  const context = useContext(SculpturesContext)

  if (!context) {
    throw new Error('useSculptures must be used inside SculpturesProvider.')
  }

  return context
}
