/**
 * Representa una moto tal como la devuelve la API (GET).
 */
export interface Moto {
  id: number
  codigo: string
  marca: string
  modelo: string
  anio: number
  cilindrada: number
  stock: number
}

/**
 * Datos que se envían al backend al crear o editar una moto.
 * El código (M001, M002...) lo genera el backend.
 */
export interface MotoFormData {
  marca: string
  modelo: string
  anio: number
  cilindrada: number
  stock: number
}

export const motoFormDataVacia: MotoFormData = {
  marca: '',
  modelo: '',
  anio: new Date().getFullYear(),
  cilindrada: 0,
  stock: 0,
}

/** Alias (mismo objeto) para quien lo importe como "Vacio" en vez de "Vacia". */
export const motoFormDataVacio = motoFormDataVacia
