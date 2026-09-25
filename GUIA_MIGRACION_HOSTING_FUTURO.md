# Guía de Respaldo Local y Migración a Hosting de Pago Propio
## Salón & Estilo — Miluska Vidaurre (Chiclayo, Perú)
**Versión de la Plataforma:** 2.5.0  
**Fecha:** Septiembre 2026  

---

## 🎯 Objetivo de esta Guía
Supabase y Vercel se configuraron como infraestructura inicial de alta velocidad y costo cero para pruebas y validación. Sin embargo, **todo el diseño, configuración, datos y esquemas de base de datos están 100% respaldados localmente en tu repositorio Git** para que puedas migrar a un hosting propio de pago (cPanel, Hostinger, VPS, etc.) en cualquier momento sin perder ningún dato ni depender de proveedores externos.

---

## 📂 Archivos de Respaldo Guardados en tu Repositorio

En la raíz de este proyecto tienes la carpeta `database/` y `scripts/`:

```
aurora-boutique/
├── database/
│   ├── schema.sql              # Esquema DDL para PostgreSQL 15 / Supabase
│   ├── schema_mysql.sql        # Esquema DDL para MySQL / MariaDB (cPanel / phpMyAdmin)
│   └── backups/
│       ├── latest_backup.json  # Última copia completa en formato JSON (datos vivos)
│       ├── latest_backup.sql   # Sentencias SQL INSERT listas para ejecutar
│       └── backup_[FECHA].json # Copias históricas con marca de tiempo
├── scripts/
│   ├── backup-cloud-data.js    # Script de respaldo: npm run db:backup
│   └── restore-cloud-data.js   # Script de restauración: npm run db:restore
```

---

## ⚡ Cómo Crear una Copia de Seguridad en 1 Clic

Tienes dos formas sencillas de respaldar:

### Método 1: Desde la Terminal (Línea de Comandos)
Cada vez que hagas cambios importantes o desees actualizar tu copia local, ejecuta:
```bash
npm run db:backup
```
Este comando se conectará a la nube, descargará todas las tablas (`store_settings`, `products`, `services`, `comparison_cases`, `orders`, `complaints`) y las guardará automáticamente en `database/backups/latest_backup.json` y `database/backups/latest_backup.sql`.

### Método 2: Desde el Panel de Administración (En tu Laptop o Celular)
1. Ingresa a la web y abre el Panel de Administración (icono de candado, clave: `salon&estilo2620`).
2. Ve a la pestaña **Ajustes**.
3. Baja hasta la sección **8. Copia de Seguridad Local & Migración de Hosting**.
4. Haz clic en **"Descargar Respaldo Completo (.JSON)"**.
5. Se descargará a tu computadora un archivo con todo el catálogo, precios, fotos, teléfonos y pedidos.

---

## 🚀 Paso a Paso: Cómo Migrar a un Hosting Tradicional Propio (cPanel / MySQL)

Cuando adquieras tu hosting (por ejemplo, Hostinger, SiteGround, Banahosting o cualquier cPanel):

### Paso 1: Crear la Base de Datos en tu Hosting
1. Ingresa a tu cPanel > **Bases de Datos MySQL**.
2. Crea una nueva base de datos (ej. `salonestilo_db`).
3. Crea un usuario MySQL y asígnale todos los privilegios a esa base de datos.
4. Abre **phpMyAdmin** > Selecciona tu base de datos recién creada.
5. Ve a la pestaña **Importar** y selecciona el archivo `database/schema_mysql.sql`.
6. Haz clic en **Continuar**; todas las tablas quedarán creadas de inmediato con soporte JSON y UTF-8.

### Paso 2: Importar los Datos del Respaldo
1. Abre `database/backups/latest_backup.sql` en un editor de texto.
2. Copia las sentencias `INSERT INTO ...` y pégalas en la pestaña **SQL** de tu phpMyAdmin, o importa el archivo directamente.
3. ¡Listo! Todos tus productos, servicios, configuración y teléfonos estarán en tu servidor propio.

### Paso 3: Subir la Aplicación Web al Hosting
1. En tu computadora, ejecuta:
   ```bash
   npm run build
   ```
2. Vite generará la carpeta `dist/` con el sitio web compilado y optimizado.
3. Comprime el contenido de `dist/` en un archivo `.zip`.
4. En tu cPanel > **Administrador de Archivos** > Entra a `public_html`.
5. Sube el `.zip` y descomprímelo directamente en `public_html`.
6. Crea o verifica un archivo `.htaccess` en `public_html` con esta regla de redirección SPA:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

---

## 🛡️ ¿Qué Pasa con las Imágenes y el Logotipo?
- Las imágenes subidas a Supabase Storage (`salon-assets`) tienen URLs HTTPS públicas directas.
- En tu respaldo JSON (`latest_backup.json`), todas las URLs de imágenes están registradas.
- Cuando tengas tu hosting propio, puedes simplemente crear una carpeta `/public/uploads/` en tu servidor y subir allí tus imágenes locales si deseas prescindir completamente de Supabase.

---

## ✅ Resumen de Garantías
* **Cero pérdida de código:** Todo está versionado en tu Git (`github.com/ardasystems/salon-y-estilo`).
* **Cero pérdida de diseño:** Los estilos HSL, fuentes y componentes residen en tu código fuente.
* **Cero pérdida de datos:** Esquemas SQL y copias JSON residen en tu disco duro y repositorio.
