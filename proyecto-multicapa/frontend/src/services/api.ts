/**
 * Configuración base para el consumo de la API REST del backend.
 * La URL se toma de la variable de entorno VITE_API_BASE_URL
 * (definida en tiempo de build para Docker, o en .env para desarrollo local).
 *
 * Aquí se agregarán, en la siguiente etapa, las funciones concretas de
 * consumo de cada endpoint (fetch/axios), por ahora solo queda preparada
 * la base URL.
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

/**
 * Error enriquecido con el mensaje que devuelve el backend
 * (GlobalExceptionHandler) para poder mostrarlo tal cual en el frontend.
 */
export class ApiError extends Error {
  status: number
  /** Errores de validación por campo (ej. { marca: "La marca es obligatoria" }),
   *  presentes solo cuando el backend responde 400 por datos inválidos. */
  detalles?: Record<string, string>

  constructor(status: number, message: string, detalles?: Record<string, string>) {
    super(message)
    this.status = status
    this.detalles = detalles
  }
}

/**
 * Wrapper mínimo sobre fetch: arma la URL a partir de API_BASE_URL,
 * serializa JSON y convierte respuestas no exitosas en ApiError con el
 * mensaje que envía el backend.
 */
export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    let mensaje = `Error ${response.status} al comunicarse con el servidor`
    let detalles: Record<string, string> | undefined
    try {
      const cuerpo = await response.json()
      mensaje = cuerpo.error ?? mensaje
      detalles = cuerpo.detalles
    } catch {
      // el cuerpo no era JSON, se usa el mensaje por defecto
    }
    throw new ApiError(response.status, mensaje, detalles)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}
