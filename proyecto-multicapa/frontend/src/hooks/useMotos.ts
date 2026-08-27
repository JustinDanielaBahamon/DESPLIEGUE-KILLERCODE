import { useCallback, useEffect, useState } from 'react'
import { actualizarMoto, crearMoto, eliminarMoto, listarMotos } from '../services/motoService'
import { ApiError } from '../services/api'
import type { Moto, MotoFormData } from '../types/moto'

interface UseMotosResult {
  motos: Moto[]
  cargando: boolean
  error: string | null
  busqueda: string
  setBusqueda: (valor: string) => void
  recargar: () => void
  guardarMoto: (datos: MotoFormData, id?: number) => Promise<boolean>
  borrarMoto: (id: number) => Promise<boolean>
}

/**
 * Encapsula la comunicación con la API REST del backend y expone el
 * estado necesario para la página de inventario (lista, carga, error,
 * búsqueda con debounce y las operaciones de creación/edición/borrado).
 */
export function useMotos(): UseMotosResult {
  const [motos, setMotos] = useState<Moto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [version, setVersion] = useState(0)

  const recargar = useCallback(() => setVersion((v) => v + 1), [])

  useEffect(() => {
    let cancelado = false
    const timeoutId = setTimeout(() => {
      setCargando(true)
      setError(null)
      listarMotos(busqueda)
        .then((datos) => {
          if (!cancelado) setMotos(datos)
        })
        .catch((err) => {
          if (cancelado) return
          const mensaje =
            err instanceof ApiError
              ? err.message
              : 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo.'
          setError(mensaje)
        })
        .finally(() => {
          if (!cancelado) setCargando(false)
        })
    }, busqueda ? 300 : 0)

    return () => {
      cancelado = true
      clearTimeout(timeoutId)
    }
  }, [busqueda, version])

  const guardarMoto = useCallback(
    async (datos: MotoFormData, id?: number) => {
      try {
        if (id) {
          await actualizarMoto(id, datos)
        } else {
          await crearMoto(datos)
        }
        recargar()
        return true
      } catch (err) {
        const mensaje = err instanceof ApiError ? err.message : 'No se pudo guardar la moto'
        setError(mensaje)
        return false
      }
    },
    [recargar],
  )

  const borrarMoto = useCallback(
    async (id: number) => {
      try {
        await eliminarMoto(id)
        recargar()
        return true
      } catch (err) {
        const mensaje = err instanceof ApiError ? err.message : 'No se pudo eliminar la moto'
        setError(mensaje)
        return false
      }
    },
    [recargar],
  )

  return { motos, cargando, error, busqueda, setBusqueda, recargar, guardarMoto, borrarMoto }
}
