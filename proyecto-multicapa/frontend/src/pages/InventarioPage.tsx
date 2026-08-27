import { useState } from 'react'
import { useMotos } from '../hooks/useMotos'
import { MotoTable } from '../components/MotoTable'
import { MotoFormModal } from '../components/MotoFormModal'
import type { Moto } from '../types/moto'

export function InventarioPage() {
  const { motos, cargando, error, busqueda, setBusqueda, guardarMoto, borrarMoto } = useMotos()
  const [modalAbierto, setModalAbierto] = useState(false)
  const [motoEnEdicion, setMotoEnEdicion] = useState<Moto | null>(null)

  const abrirParaCrear = () => {
    setMotoEnEdicion(null)
    setModalAbierto(true)
  }

  const abrirParaEditar = (moto: Moto) => {
    setMotoEnEdicion(moto)
    setModalAbierto(true)
  }

  const manejarEliminar = async (moto: Moto) => {
    const confirmado = window.confirm(`¿Eliminar la moto ${moto.codigo} (${moto.marca} ${moto.modelo})?`)
    if (confirmado) {
      await borrarMoto(moto.id)
    }
  }

  return (
    <div className="pagina">
      <header className="encabezado">
        <h1>Proyecto Multicapa - SENA</h1>
        <p>CRUD para Inventario de Motos implementado. Este sistema interactúa con la API REST del backend.</p>
      </header>

      <div className="barra-acciones">
        <button type="button" className="btn-primario" onClick={abrirParaCrear}>
          + Añadir Nueva Moto
        </button>
        <input
          type="search"
          className="input-busqueda"
          placeholder="Buscar motos..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {error && <p className="mensaje-error">{error}</p>}

      <MotoTable motos={motos} cargando={cargando} onEditar={abrirParaEditar} onEliminar={manejarEliminar} />

      {modalAbierto && (
        <MotoFormModal
          motoEnEdicion={motoEnEdicion}
          onCerrar={() => setModalAbierto(false)}
          onGuardar={guardarMoto}
        />
      )}
    </div>
  )
}
