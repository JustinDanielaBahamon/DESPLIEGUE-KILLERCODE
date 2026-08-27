import { apiFetch } from './api'
import type { Moto, MotoFormData } from '../types/moto'

export function listarMotos(busqueda?: string): Promise<Moto[]> {
  const query = busqueda?.trim() ? `?q=${encodeURIComponent(busqueda.trim())}` : ''
  return apiFetch<Moto[]>(`/motos${query}`)
}

export function crearMoto(datos: MotoFormData): Promise<Moto> {
  return apiFetch<Moto>('/motos', {
    method: 'POST',
    body: JSON.stringify(datos),
  })
}

export function actualizarMoto(id: number, datos: MotoFormData): Promise<Moto> {
  return apiFetch<Moto>(`/motos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  })
}

export function eliminarMoto(id: number): Promise<void> {
  return apiFetch<void>(`/motos/${id}`, {
    method: 'DELETE',
  })
}
