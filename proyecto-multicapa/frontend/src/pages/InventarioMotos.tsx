import { useEffect, useState } from 'react'
import type { Moto, MotoFormData } from '../types/moto'
import { motoFormDataVacia } from '../types/moto'
import { actualizarMoto, crearMoto, eliminarMoto, listarMotos } from '../services/motoService'
import { ApiError } from '../services/api'
import MotoForm from '../components/MotoForm'
import MotoTable from '../components/MotoTable'

export default function InventarioMotos() {
  const [motos, setMotos] = useState<Moto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [mostrarForm, setMostrarForm] = useState(false)
  const [motoEnEdicion, setMotoEnEdicion] = useState<Moto | null>(null)
  const [erroresForm, setErroresForm] = useState<Record<string, string>>()
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    cargarMotos()
  }, [])

  async function cargarMotos() {
    setCargando(true)
    setError(null)
    try {
      const data = await listarMotos()
      setMotos(data)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo cargar el inventario')
    } finally {
      setCargando(false)
    }
  }

  function abrirFormularioNuevo() {
    setMotoEnEdicion(null)
    setErroresForm(undefined)
    setMostrarForm(true)
  }

  function abrirFormularioEdicion(moto: Moto) {
    setMotoEnEdicion(moto)
    setErroresForm(undefined)
    setMostrarForm(true)
  }

  function cerrarFormulario() {
    setMostrarForm(false)
    setMotoEnEdicion(null)
    setErroresForm(undefined)
  }

  async function handleGuardar(data: MotoFormData) {
    setEnviando(true)
    setErroresForm(undefined)
    try {
      if (motoEnEdicion) {
        await actualizarMoto(motoEnEdicion.id, data)
      } else {
        await crearMoto(data)
      }
      cerrarFormulario()
      await cargarMotos()
    } catch (err) {
      if (err instanceof ApiError && err.detalles) {
        setErroresForm(err.detalles)
      } else {
        setError(err instanceof ApiError ? err.message : 'No se pudo guardar la moto')
      }
    } finally {
      setEnviando(false)
    }
  }

  async function handleEliminar(moto: Moto) {
    const confirmar = window.confirm(`¿Eliminar la moto ${moto.codigo} (${moto.marca} ${moto.modelo})?`)
    if (!confirmar) return

    try {
      await eliminarMoto(moto.id)
      await cargarMotos()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo eliminar la moto')
    }
  }

  return (
    <div className="inventario-motos pagina">
      <header className="encabezado inventario-header">
        <h1>Inventario de Motos</h1>
        {!mostrarForm && (
          <button type="button" className="btn-primario" onClick={abrirFormularioNuevo}>
            + Registrar moto
          </button>
        )}
      </header>

      {error && <p className="error-general">{error}</p>}

      {mostrarForm && (
        <section className="form-section">
          <h2>{motoEnEdicion ? 'Editar moto' : 'Registrar moto'}</h2>
          <MotoForm
            valoresIniciales={motoEnEdicion ?? motoFormDataVacia}
            errores={erroresForm}
            enviando={enviando}
            onSubmit={handleGuardar}
            onCancelar={cerrarFormulario}
          />
        </section>
      )}

      {cargando ? (
        <p className="estado-tabla">Cargando inventario...</p>
      ) : (
        <MotoTable motos={motos} cargando={false} onEditar={abrirFormularioEdicion} onEliminar={handleEliminar} />
      )}
    </div>
  )
}
