# Arquitectura y Configuración Técnica
## Plataforma Web Integral: Salón & Estilo (Miluska Vidaurre)
**Ubicación:** Chiclayo, Lambayeque - Perú  
**Versión:** 2.5.0 (Producción Cloud & Multi-dispositivo)  
**Fecha de Publicación:** Septiembre 2026  
**Hosting Frontend:** Vercel (`https://salon-y-estilo.vercel.app`)  
**Backend / Base de Datos:** Supabase Cloud (PostgreSQL 15 + Realtime + Storage CDN)  

---

## 1. Resumen Ejecutivo de la Arquitectura
La plataforma de **Salón & Estilo** ha evolucionado de un modelo basado en almacenamiento local a una **Arquitectura Cloud Híbrida de Alta Disponibilidad**, diseñada bajo el paradigma de **Single Page Application (SPA) ultraligera con backend Serverless en tiempo real**.

Los cambios administrativos realizados desde cualquier dispositivo (laptop, computadora de escritorio, tablet o celular) —como el logotipo del salón, forma del logo, información de contacto, catálogo de productos, servicios, casos de antes y después y pedidos— se persisten en la nube en milisegundos y se sincronizan instantáneamente con todos los dispositivos y visitantes activos sin recargar la página.

### Diagrama de Flujo y Sincronización en la Nube
```
[ Dispositivo Admin: Laptop / Celular ]
                   │
                   ▼ (Subida / Actualización)
[ Vite + React SPA Client Layer ]
        ├── StoreContext (Gestión de Estado Centralizada)
        ├── Supabase Client SDK (@supabase/supabase-js)
        ├── Image Compression Engine (Canvas Web Worker)
        └── jsPDF Generator (Emisión de Comprobantes Vectoriales)
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
[ Supabase PostgreSQL ]    [ Supabase Storage ]
  • store_settings           • salon-assets/logos/
  • products                 • salon-assets/qr/
  • services                 • salon-assets/products/
  • comparison_cases         • salon-assets/vouchers/
  • orders                   • salon-assets/comparisons/
  • complaints
         │
         ▼ (Supabase Realtime WebSocket Pub/Sub)
[ Todos los Clientes Móviles / Desktop / Pestañas Incógnito ]
  • Sincronización automática en vivo sin recargar
```

---

## 2. Stack Tecnológico

| Capa | Tecnología Seleccionada | Justificación Técnica |
| :--- | :--- | :--- |
| **Frontend Core** | React 19.x + Vite 8.x | Carga instantánea con HMR, empaquetado optimizado en chunks gzip (< 360 kB) y máxima velocidad de renderizado. |
| **Backend & Cloud DB** | Supabase (PostgreSQL 15) | Base de datos relacional serverless con Row Level Security (RLS), API REST PostgREST y escalabilidad instantánea. |
| **Sincronización en Vivo** | Supabase Realtime (WebSockets) | Permite que cambios de logotipo o nuevos productos se reflejen de inmediato en todos los teléfonos y laptops abiertos. |
| **Almacenamiento Multimedia** | Supabase Storage (`salon-assets`) | Bucket público con CDN global para alojar logos, códigos QR de Yape/Plin, comprobantes de pago y fotos de servicios. |
| **Estilos & Layout** | Vanilla CSS Moderno + Tokens HSL | Control absoluto sobre glassmorphism, responsive breakpoints y safe areas para iOS y Android sin pesadez de frameworks. |
| **Iconografía** | Lucide React | Iconos SVG ultraligeros cargados en bundle optimizado por árbol de dependencias (Tree-Shaking). |
| **Motor de Documentos** | jsPDF | Emisión nativa de comprobantes de pago en PDF dentro del navegador del usuario sin requerir backend ni consumo de API externa. |
| **Compresor Multimedia** | Canvas Compression Engine (`imageCompressor.js`) | Reescalado dinámico a máx. 1000x1000px y compresión JPEG 0.82 antes de subir a la nube para cuidar ancho de banda. |
| **Caché & Resiliencia Local** | LocalStorage Synchronizer | Caché de lectura instantánea para inicio con cero latencia y tolerancia a fallos offline temporales. |
| **Despliegue & Hosting** | Vercel CDN Global | Despliegue continuo automatizado mediante Git (`main` branch) con rewrites SPA (`vercel.json`). |

---

## 3. Configuración de Base de Datos y Supabase

### 3.1. Credenciales y Proyecto Cloud
* **Project Reference:** `fmjnmjkzbbqmldgnmwvz`
* **Project URL:** `https://fmjnmjkzbbqmldgnmwvz.supabase.co`
* **Publishable / Anon Key:** `sb_publishable_6uMUfL82MQQiwtt-h2lmkQ_LY4mHND3`
* **Database URI (PostgreSQL):** `postgresql://postgres:[PASSWORD]@db.fmjnmjkzbbqmldgnmwvz.supabase.co:5432/postgres`
* **Storage Bucket:** `salon-assets` (Público con políticas de lectura y subida)

### 3.2. Esquema de Tablas en Supabase

#### Tabla `public.store_settings`
Almacena la configuración general de la tienda y la identidad corporativa:
* `id` (TEXT, Primary Key): Valor constante `'current'`.
* `data` (JSONB): Objeto con nombre del salón, eslogan, subtítulo, logotipo (`logoUrl`), forma del logo (`logoShape`: `'circle'` o `'square'`), teléfonos, QR de Yape y Plin, redes sociales, horarios y tarifas de despacho.
* `updated_at` (TIMESTAMPTZ): Registro de última modificación.

#### Tabla `public.products`
Catálogo de productos de la boutique capilar y skincare:
* `id` (TEXT, Primary Key): Ej. `'prod-001'`.
* `name` (TEXT): Nombre comercial del producto.
* `category` (TEXT): Categoría (Capilar, Skincare, Tratamientos, etc.).
* `price` (NUMERIC): Precio actual de venta en Soles (S/).
* `stock` (INT): Cantidad disponible en inventario.
* `data` (JSONB): Datos completos (imágenes, variantes de tono, palabras clave, beneficios, descripción).
* `created_at` / `updated_at` (TIMESTAMPTZ).

#### Tabla `public.services`
Catálogo de servicios de belleza y estilismo del salón:
* `id` (TEXT, Primary Key): Ej. `'srv-001'`.
* `name` (TEXT): Nombre del servicio.
* `category` (TEXT): Colorimetría, Alisados, Cortes, etc.
* `price` (NUMERIC): Precio base en Soles (S/).
* `data` (JSONB): Duración estimada, detalles incluidos, foto descriptiva.
* `created_at` / `updated_at` (TIMESTAMPTZ).

#### Tabla `public.comparison_cases`
Casos de transformación estética "Antes & Después":
* `id` (TEXT, Primary Key).
* `title` (TEXT): Título del procedimiento.
* `category` (TEXT): Categoría estética.
* `data` (JSONB): Fotos de antes y después, duración del procedimiento y detalles clínicos.
* `updated_at` (TIMESTAMPTZ).

#### Tabla `public.orders`
Registro de pedidos y órdenes de compra:
* `id` (TEXT, Primary Key): Formato estructurado (`SE-CHIC-XXXX` / `SE-PIM-XXXX`).
* `customer` (JSONB): Datos del cliente (nombre, DNI, teléfono, dirección, ciudad).
* `items` (JSONB): Lista de productos adquiridos con cantidades y precios.
* `total` (NUMERIC): Importe final pagado.
* `payment_status` (TEXT): `'pendiente'`, `'completado'` o `'cancelado'`.
* `data` (JSONB): Orden completa incluyendo URL del comprobante de pago y método de despacho.
* `created_at` (TIMESTAMPTZ).

#### Tabla `public.complaints`
Libro de Reclamaciones Virtual conforme a ley peruana:
* `id` (TEXT, Primary Key): Código correlativo (`LRV-2026-XXXX`).
* `correlative` (TEXT).
* `data` (JSONB): Datos del reclamante, motivo del reclamo y descargo.
* `created_at` (TIMESTAMPTZ).

---

## 4. Políticas de Seguridad (Row Level Security - RLS)
Todas las tablas cuentan con RLS activado con políticas de acceso anónimo seguro:
* **Lectura Pública (`SELECT`):** Habilitada para que todos los visitantes de la web puedan ver el logotipo actualizado, catálogo de productos, servicios y casos de éxito.
* **Inserción Pública (`INSERT`):** Habilitada para permitir la creación de órdenes de compra, carga de comprobantes y registro de reclamos.
* **Actualización (`UPDATE`):** Habilitada para sincronización de pedidos y ajustes desde el panel de control administrativo.

---

## 5. Almacenamiento Multimedia (`salon-assets`)
Para optimizar el rendimiento y evitar sobrecargar la base de datos con cadenas base64:
1. Las imágenes seleccionadas por el administrador o cliente se comprimen en el cliente mediante HTML5 Canvas.
2. La función `uploadToSalonAssets(fileOrBlob, folder)` en `src/lib/supabase.js` sube el archivo al bucket `salon-assets` en Supabase.
3. Se genera un enlace público HTTPS permanente (ej. `https://fmjnmjkzbbqmldgnmwvz.supabase.co/storage/v1/object/public/salon-assets/logos/logo.jpg`).
4. Si la red tiene restricciones momentáneas, el sistema incluye un mecanismo de contingencia transparente para continuar la operación sin interrupciones.

---

## 6. Variables de Entorno y Despliegue en Vercel

### Archivo `.env` Local y en Producción:
```env
VITE_SUPABASE_URL=https://fmjnmjkzbbqmldgnmwvz.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_6uMUfL82MQQiwtt-h2lmkQ_LY4mHND3
```

### Configuración en el Dashboard de Vercel:
Para asegurar que los builds en Vercel tomen las variables de entorno:
1. Ingresar a `https://vercel.com/` > Seleccionar el proyecto `salon-y-estilo`.
2. Ir a **Settings** > **Environment Variables**.
3. Agregar:
   * `VITE_SUPABASE_URL` = `https://fmjnmjkzbbqmldgnmwvz.supabase.co`
   * `VITE_SUPABASE_ANON_KEY` = `sb_publishable_6uMUfL82MQQiwtt-h2lmkQ_LY4mHND3`
4. Guardar y desplegar.

---

## 7. Plan de Migración Futura a Hosting Propio
Para garantizar que el negocio no tenga dependencia cautiva (*vendor lock-in*) con Supabase ni Vercel:
1. **Esquemas SQL Nativos Guardados en el Repositorio:**
   * `database/schema.sql`: Definición DDL completa para PostgreSQL 15 / Supabase.
   * `database/schema_mysql.sql`: Definición DDL completa para MySQL 5.7/8.0 y MariaDB (compatible directamente con phpMyAdmin y cualquier hosting cPanel como Hostinger, Banahosting o SiteGround).
2. **Capa de Abstracción en Código:** Todo el acceso a datos se encuentra centralizado en `src/context/StoreContext.jsx` y `src/lib/supabase.js`. Para migrar a una API propia en PHP, Node.js (Express/Fastify) o Python (FastAPI), solo será necesario cambiar las llamadas en `StoreContext.jsx` hacia los nuevos endpoints del servidor.
3. **Guía Oficial de Migración:** Los pasos detallados de importación, configuración de base de datos y subida a cPanel están documentados en [GUIA_MIGRACION_HOSTING_FUTURO.md](GUIA_MIGRACION_HOSTING_FUTURO.md).

---

## 8. Herramientas de Respaldo Local (Backups Automáticos y Manuales)

### 8.1. Respaldo Automático por CLI (Línea de Comandos)
Se han integrado comandos de Node.js en `package.json` para descargar y restaurar copias de seguridad de la base de datos completa:
* **Exportar Copia de Seguridad:**
  ```bash
  npm run db:backup
  ```
  Conecta con Supabase y genera automáticamente:
  * `database/backups/latest_backup.json` (Datos en formato JSON estructurado)
  * `database/backups/latest_backup.sql` (Sentencias SQL INSERT listas para ejecutar)
  * `database/backups/backup_[TIMESTAMP].json` (Histórico de respaldo con fecha y hora)

* **Restaurar Copia de Seguridad:**
  ```bash
  npm run db:restore
  ```
  Restaura los datos del respaldo local hacia la base de datos activa.

### 8.2. Respaldo en 1 Clic desde el Panel de Administración Web
En el panel de control administrativo (`AdminDashboard.jsx`), pestaña **Ajustes**, sección **"8. Copia de Seguridad Local & Migración de Hosting"**:
* **Botón "Descargar Respaldo Completo (.JSON)":** Permite al administrador descargar una copia de seguridad física a su computadora con toda la configuración, catálogo de productos, servicios, precios, fotos y pedidos.
* **Botón "Restaurar desde Archivo (.JSON)":** Permite importar una copia previa en caso de contingencia o cambio de servidor.
