import { useState } from 'react'
import type { FormEvent } from 'react'
import type { MotoFormData } from '../types/moto'

interface MotoFormProps {
  valoresIniciales: MotoFormData
  errores?: Record<string, string>
  enviando: boolean
  onSubmit: (datos: MotoFormData) => void | Promise<void>
  onCancelar: () => void
}

export default function MotoForm({ valoresIniciales, errores, enviando, onSubmit, onCancelar }: MotoFormProps) {
  const [datos, setDatos] = useState<MotoFormData>(valoresIniciales)

  const handleSubmit = (evento: FormEvent) => {
    evento.preventDefault()
    onSubmit(datos)
  }

  return (
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
        {errores?.marca && <span className="error-campo">{errores.marca}</span>}
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
        {errores?.modelo && <span className="error-campo">{errores.modelo}</span>}
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
          {errores?.anio && <span className="error-campo">{errores.anio}</span>}
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
          {errores?.cilindrada && <span className="error-campo">{errores.cilindrada}</span>}
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
          {errores?.stock && <span className="error-campo">{errores.stock}</span>}
        </label>
      </div>

      <div className="formulario-acciones">
        <button type="button" className="btn-secundario" onClick={onCancelar} disabled={enviando}>
          Cancelar
        </button>
        <button type="submit" className="btn-primario" disabled={enviando}>
          {enviando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
