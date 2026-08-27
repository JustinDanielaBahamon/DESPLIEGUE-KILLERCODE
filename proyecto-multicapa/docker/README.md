# docker/

Carpeta reservada para configuración de infraestructura que **no pertenece**
a un servicio específico (frontend, backend o database), por ejemplo, en
etapas posteriores del proyecto:

- Configuración de un reverse proxy (Nginx/Traefik) si se agrega frontend
  de acceso único.
- Scripts de aprovisionamiento de la máquina virtual Ubuntu Server.
- Archivos `docker-compose.override.yml` para entornos específicos
  (desarrollo, producción).

Por ahora está vacía intencionalmente: los `Dockerfile` de cada servicio
viven junto a su propio código (`frontend/Dockerfile`,
`backend/Dockerfile`) y la orquestación general está en el
`docker-compose.yml` de la raíz del proyecto.
