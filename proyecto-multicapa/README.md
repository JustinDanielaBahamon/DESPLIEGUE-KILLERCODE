# Proyecto Multicapa - Despliegue con Docker sobre Linux

Proyecto de práctica para la actividad del SENA **"Despliegue de una
aplicación multicapa en Docker sobre Linux"**.

## Objetivo

Construir y desplegar una aplicación multicapa (frontend, backend y base de
datos) totalmente contenerizada con Docker Compose, ejecutándose sobre una
máquina virtual con Ubuntu Server.

> **Estado actual:** CRUD completo de inventario de motos implementado en
> las 3 capas: tabla `motos` en MySQL, entidad/repositorio/servicio/
> controlador REST en Spring Boot, y página React con tabla, búsqueda y
> formulario de alta/edición/borrado consumiendo la API.

## Arquitectura

```
Frontend (React + Vite)
        │  HTTP / REST
        ▼
Backend (Java + Spring Boot)
        │  SQL (JDBC)
        ▼
Base de datos (MySQL)
```

Los tres servicios se comunican dentro de una misma red Docker
(`multicapa-net`) usando el **nombre del servicio** como host (no IPs fijas):
`frontend → backend:8080`, `backend → database:3306`.

## Tecnologías

| Capa          | Tecnología                                  |
|---------------|----------------------------------------------|
| Frontend      | React + Vite + TypeScript                    |
| Backend       | Java 17 + Spring Boot + Maven                |
| Base de datos | MySQL 8                                      |
| Infraestructura | Docker, Docker Compose, Ubuntu Server      |

## Estructura de carpetas

```
proyecto-multicapa/
├── frontend/       # Aplicación React (UI, consumo de la API REST)
├── backend/        # API REST en Spring Boot (controller/service/repository/entity/config)
├── database/       # Scripts SQL de inicialización (DDL/DML) y respaldos
├── docker/         # Infraestructura compartida (reservado para etapas futuras)
├── .env            # Variables de entorno reales (NO se sube a Git)
├── .env.example    # Plantilla documentada de variables de entorno
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Servicios y puertos

| Servicio  | Puerto host | Puerto interno | Descripción                          |
|-----------|-------------|-----------------|---------------------------------------|
| frontend  | 3000        | 80              | Build de producción servido con Nginx |
| backend   | 8080        | 8080            | API REST (Spring Boot)                |
| database  | 3306        | 3306            | MySQL                                 |

Se eligió el puerto **3000** en el host para el frontend (en vez del 5173
de desarrollo) porque en producción se sirve el build ya compilado a
través de Nginx en el puerto 80 del contenedor; 5173 es solo el puerto del
servidor de desarrollo de Vite y no se usa en el contenedor final.

## Red Docker

`docker-compose.yml` define una red tipo `bridge` llamada `multicapa-net`.
Los tres servicios se conectan a ella y se resuelven entre sí por nombre de
servicio (DNS interno de Docker), evitando depender de IPs fijas de la
máquina virtual.

## Volumen y persistencia

El servicio `database` usa el volumen `db_data`, definido en
`docker-compose.yml`, para que los datos de MySQL sobrevivan a reinicios o
recreación de contenedores.

## Variables de entorno

Todas las variables necesarias están documentadas en `.env.example`
(base de datos, backend y frontend). Copia ese archivo como `.env` y
ajusta los valores antes de levantar el proyecto:

```bash
cp .env.example .env
```

## Cómo levantar el proyecto

```bash
docker compose up -d
```

## Cómo comprobar los contenedores

```bash
docker compose ps
```

## Cómo detener el proyecto

```bash
docker compose down
```

Para eliminar también el volumen de la base de datos (borra los datos):

```bash
docker compose down -v
```

## API REST (backend)

| Método | Endpoint            | Descripción                          |
|--------|----------------------|---------------------------------------|
| GET    | `/api/motos`         | Lista todas las motos (o filtra con `?q=texto`) |
| GET    | `/api/motos/{id}`    | Obtiene una moto por id               |
| POST   | `/api/motos`         | Crea una moto (el código M001... se genera solo) |
| PUT    | `/api/motos/{id}`    | Actualiza una moto                    |
| DELETE | `/api/motos/{id}`    | Elimina una moto                      |
| GET    | `/api/health`        | Verifica que el backend esté arriba   |

## Próximos pasos

- Agregar paginación/ordenamiento si el inventario crece mucho.
- Agregar autenticación si se requiere restringir el acceso.
