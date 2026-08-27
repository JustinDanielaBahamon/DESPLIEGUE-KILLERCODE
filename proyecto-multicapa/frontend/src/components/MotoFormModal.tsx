import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Moto, MotoFormData } from '../types/moto'
import { motoFormDataVacia } from '../types/moto'

interface MotoFormModalProps {
  motoEnEdicion: Moto | null
  onCerrar: () => void
  onGuardar: (datos: MotoFormData, id?: number) => Promise<boolean>
}

export function MotoFormModal({ motoEnEdicion, onCerrar, onGuardar }: MotoFormModalProps) {
  const [datos, setDatos] = useState<MotoFormData>(motoFormDataVacia)
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (motoEnEdicion) {
      const { marca, modelo, anio, cilindrada, stock } = motoEnEdicion
      setDatos({ marca, modelo, anio, cilindrada, stock })
    } else {
      setDatos(motoFormDataVacia)
    }
  }, [motoEnEdicion])

  const handleSubmit = async (evento: FormEvent) => {
    evento.preventDefault()
    setGuardando(true)
    const exito = await onGuardar(datos, motoEnEdicion?.id)
    setGuardando(false)
    if (exito) {
      onCerrar()
    }
  }

  return (
    <div className="modal-fondo" onClick={onCerrar}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <h2>{motoEnEdicion ? 'Editar moto' : 'Añadir nueva moto'}</h2>
        <form onSubmit={handleSubmit} className="formulario-moto">
          <label>
            Marca
            <input
              required
              type="text"
              value={datos.marca}
              onChange={(e) => setDatos({ ...datos, marca: e.target.value })}
              placeholder="Ej. Yamaha"
            />
          </label>

          <label>
            Modelo
            <input
              required
              type="text"
              value={datos.modelo}
              onChange={(e) => setDatos({ ...datos, modelo: e.target.value })}
              placeholder="Ej. MT-07"
            />
          </label>

          <div className="formulario-fila">
            <label>
              Año
              <input
                required
                type="number"
                min={1980}
                max={2100}
                value={datos.anio}
                onChange={(e) => setDatos({ ...datos, anio: Number(e.target.value) })}
              />
            </label>

            <label>
              Cilindrada (cc)
              <input
                required
                type="number"
                min={1}
                value={datos.cilindrada}
                onChange={(e) => setDatos({ ...datos, cilindrada: Number(e.target.value) })}
              />
            </label>

            <label>
              Stock
              <input
                required
                type="number"
                min={0}
                value={datos.stock}
                onChange={(e) => setDatos({ ...datos, stock: Number(e.target.value) })}
              />
            </label>
          </div>

          <div className="formulario-acciones">
            <button type="button" className="btn-secundario" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn-primario" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
