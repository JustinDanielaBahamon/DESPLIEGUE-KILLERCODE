import type { Moto } from '../types/moto'

interface MotoTableProps {
  motos: Moto[]
  cargando: boolean
  onEditar: (moto: Moto) => void
  onEliminar: (moto: Moto) => void
}

function MotoTable({ motos, cargando, onEditar, onEliminar }: MotoTableProps) {
  if (cargando) {
    return <p className="estado-tabla">Cargando inventario...</p>
  }

  if (motos.length === 0) {
    return <p className="estado-tabla">No hay motos registradas todavía.</p>
  }

  return (
    <table className="tabla-motos">
      <thead>
        <tr>
          <th>ID</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Año</th>
          <th>Cilindrada (cc)</th>
          <th>Stock</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {motos.map((moto) => (
          <tr key={moto.id}>
            <td>{moto.codigo}</td>
            <td>{moto.marca}</td>
            <td>{moto.modelo}</td>
            <td>{moto.anio}</td>
            <td>{moto.cilindrada}</td>
            <td>{moto.stock}</td>
            <td className="celda-acciones">
              <button
                type="button"
                className="btn-icono"
                aria-label={`Editar ${moto.marca} ${moto.modelo}`}
                onClick={() => onEditar(moto)}
              >
                ✏️
              </button>
              <button
                type="button"
                className="btn-icono"
                aria-label={`Eliminar ${moto.marca} ${moto.modelo}`}
                onClick={() => onEliminar(moto)}
              >
                🗑️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export { MotoTable }
export default MotoTable
