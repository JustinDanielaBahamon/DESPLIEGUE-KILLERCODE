# database/

Contiene todo lo relacionado con la base de datos MySQL del proyecto.

## Estructura

- **init/** — Scripts SQL que MySQL ejecuta automáticamente la primera vez
  que se crea el contenedor (montados en `/docker-entrypoint-initdb.d`).
  Se ejecutan en orden alfabético/numérico:
  - `00-ddl.sql` → creación de tablas (DDL).
  - `01-dml.sql` → datos iniciales (DML).
- **backups/** — Carpeta para respaldos manuales de la base de datos
  (`.sql` generados con `mysqldump`). No se versiona su contenido en Git,
  solo la carpeta (ver `.gitkeep`).

## Persistencia

Los datos de MySQL se almacenan en el volumen Docker `db_data`, definido en
el `docker-compose.yml` de la raíz del proyecto. Esto garantiza que la
información sobreviva a reinicios o recreación de contenedores.

> Importante: los scripts de `init/` solo se ejecutan la **primera vez**
> que se crea el volumen. Si necesitas volver a ejecutarlos desde cero,
> debes eliminar el volumen (`docker compose down -v`).

## Próxima etapa

En la siguiente etapa del proyecto se agregarán aquí las tablas definitivas,
las relaciones entre ellas y los datos iniciales necesarios para el
funcionamiento de la aplicación.
