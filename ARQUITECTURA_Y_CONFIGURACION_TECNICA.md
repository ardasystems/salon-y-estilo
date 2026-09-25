# Arquitectura y Configuración Técnica
## Plataforma Web Integral: Salon&Estilo (Miluska Vidaurre)
**Ubicación:** Chiclayo, Lambayeque - Perú  
**Versión:** 2.4.0 (Edición Producción & Mobile-First)  
**Fecha de Publicación:** Septiembre 2026  

---

## 1. Resumen Ejecutivo de la Arquitectura
La plataforma de **Salon&Estilo** ha sido diseñada bajo el paradigma de **Single Page Application (SPA) ultraligera, reactiva y desacoplada**. A diferencia de los CMS tradicionales monolíticos y pesados (como WordPress o temas legacy de Shopify), la solución está construida sobre una arquitectura moderna basada en componentes modulares, optimizada para responder con latencia cero en conexiones móviles 4G/5G y redes Wi-Fi locales en Perú.

### Diagrama de Flujo y Componentes
```
[ Cliente Móvil / Desktop ]
           │
           ▼
[ Vite + React 18 SPA Engine ]
     ├── StoreContext (Gestión de Estado Global & Persistencia LocalStorage)
     ├── Image Compressor Web Worker / Canvas (Optimización client-side)
     ├── jsPDF Engine (Generación Vectorial de Recibos y Comprobantes)
     └── Responsive UI Layer (Dark Luxe Design System)
           │
           ├── Catálogo de Cosmética & Skincare (Búsqueda por Keywords)
           ├── Reservas de Servicios de Salón (WhatsApp Direct Bridge)
           ├── Casos Clínicos Antes & Después (Comparador interactivo)
           ├── Pasarela de Cobro Híbrida:
           │     ├── Yape / Plin Directo + Subida y Compresión de Voucher
           │     └── Culqi Gateway (Tarjetas de Débito/Crédito y OTP Yape)
           └── Panel de Administración Integrado (Inventario, Precios, Órdenes)
```

---

## 2. Stack Tecnológico

| Capa | Tecnología Seleccionada | Justificación Técnica |
| :--- | :--- | :--- |
| **Núcleo Frontend** | React 18.x + Vite 8.x | Carga instantánea con HMR, empaquetado optimizado en chunks gzip (< 260 kB base) y máxima velocidad de renderizado. |
| **Estilos & Layout** | Vanilla CSS Moderno + Tokens HSL | Cero sobrecarga de frameworks como Tailwind o Bootstrap. Control absoluto sobre glassmorphism, responsive breakpoints y safe areas para iOS y Android. |
| **Iconografía** | Lucide React | Iconos SVG ultraligeros cargados en bundle optimizado por árbol de dependencias (Tree-Shaking). |
| **Motor de Documentos** | jsPDF | Emisión nativa de comprobantes de pago en PDF dentro del navegador del usuario sin requerir backend ni consumo de API externa. |
| **Compresor Multimedia** | Canvas Compression Engine (`imageCompressor.js`) | Reescalado dinámico a máx. 1000x1000px y compresión JPEG 0.82. Reduce imágenes de 8 MB a menos de 180 KB en milisegundos, cuidando memoria y almacenamiento. |
| **Persistencia de Sesión** | Web Storage API (LocalStorage con Serialización Segura) | Resistencia total a recargas accidentales durante el checkout o tras realizar el pago. |
| **Efectos & Micro-interacciones** | Canvas-Confetti + CSS GPU Transforms | Animaciones a 60 FPS sin ralentizar el hilo principal de renderizado. |

---

## 3. Módulos y Arquitectura de Datos

### 3.1. StoreContext (`src/context/StoreContext.jsx`)
Centraliza el estado reactivo de toda la tienda mediante React Context y React Hooks:
* **`products`**: Array reactivo de cosméticos con soporte para múltiples imágenes, categorías, etiquetas (Bestseller, Nuevo), precios tachados, stock disponible y palabras clave indexadas para el motor de búsqueda en tiempo real.
* **`services`**: Catálogo de tratamientos de peluquería, colorimetría y estética, con duraciones estimadas, precios base y detalle de servicios incluidos.
* **`comparisonCases`**: Lista de casos "Antes & Después" con etiquetas personalizadas, estadísticas de resultado y miniaturas comparativas interactivas.
* **`cart`**: Carrito dinámico con cálculo automático de subtotales, variantes de tono y control de cantidades.
* **`orders`**: Registro cronológico de compras con id único estructurado (`SE-CHIC-XXXX` / `SE-PIM-XXXX`), detalle de despacho, datos del cliente y constancia de pago vinculada.
* **`settings`**: Parámetros globales de la tienda (logotipo en base64, nombre comercial, eslogan, dirección del salón en Chiclayo, números y titulares de Yape/Plin, credenciales de administración, enlaces sociales dinámicos y costos de despacho).

### 3.2. Mecanismo de Persistencia y Resiliencia en Checkout
Para evitar la pérdida de carritos o compras en curso si el usuario recarga la página o cambia de app en su teléfono móvil:
1. **Restauración Automática de Sesión:** El estado `isCheckoutOpen` verifica la llave `salonestilo_active_checkout` al inicializarse. Si el cliente estaba en medio del proceso o en la pantalla de éxito, la interfaz se reabre de inmediato en el paso exacto.
2. **Preservación de Datos:** Los campos de contacto (nombre, DNI, celular, dirección, modalidad de despacho) y el voucher cargado permanecen sincronizados en tiempo real en el almacenamiento local.
3. **Control de Ciclo de Vida:** Al hacer clic en "Continuar en la Tienda", se depura la sesión temporal activa permitiendo iniciar una nueva compra en limpio.

---

## 4. Flujo de Cobro & Validación de Comprobantes

### Flujo Operativo Paso a Paso:
```
[ 1. Selección de Productos ]
           │
[ 2. Carrito de Compras (Cart Drawer) ]
           │
[ 3. Checkout: Datos de Envío & Despacho ]
     (Retiro en Salón Chiclayo / Envío Domicilio Chiclayo / Envío Nacional Shalom-Olva)
           │
[ 4. Selección de Método de Pago ]
     ├── Opción A: Yape / Plin Directo (Muestra QR Dinámico + Celular Oficial)
     └── Opción B: Pasarela Culqi (Tarjetas bancarias o Yape OTP con token)
           │
[ 5. Carga de Comprobante / Voucher ]
     ├── Captura con Cámara del Celular o Selección de Galería
     ├── Compresión Automática (Canvas Engine a < 200 KB)
     └── Nomenclatura del archivo: COMPROBANTE_[Nombre]_[DNI]_[Timestamp].jpg
           │
[ 6. Habilitación de Descarga Oficial ]
     └── Botón "Descargar Constancia Oficial (PDF)" con detalle de orden y productos
           │
[ 7. Confirmación y Envío a WhatsApp ]
     └── Apertura de chat verificado con mensaje estructurado y código de comprobante
           │
[ 8. Panel de Control Administrativo ]
     └── Visualización de miniatura del voucher, link de descarga directa y cambio de estado
```

---

## 5. Panel de Control de Administración (`AdminDashboard.jsx`)
El sistema cuenta con un centro de mando protegido por clave para los gestores del salón:
* **Gestión de Catálogo:** Creación, edición y eliminación de productos con subida de imágenes comprimidas y asignación de palabras clave.
* **Gestión de Servicios:** Ajuste de tiempos, precios referenciales y textos de valor.
* **Módulo Antes & Después:** Actualización de casos clínicos reales para demostrar la técnica profesional del salón.
* **Órdenes & Comprobantes:** Panel de auditoría de pedidos donde el administrador puede inspeccionar la foto del voucher enviada por cada cliente, descargarlo en su tamaño original o validar el estado de entrega.
* **Configuración de Tienda:** Modificación del logo, QR de Yape/Plin, datos bancarios, redes sociales activas (Facebook, Instagram, TikTok) y costos de envío.

---

## 6. Despliegue, Infraestructura y Recomendaciones
1. **Hosting Recomendado:** Netlify, Vercel o Cloudflare Pages (Capacidades de CDN globales, certificados SSL gratuitos y despliegue continuo mediante Git).
2. **Dominio Personalizado:** Configurar registros DNS de tipo CNAME o ALIAS apuntando a la plataforma.
3. **Escalabilidad Futura:** La arquitectura actual soporta hasta miles de visitas concurrentes sin coste de servidor dinámico. Cuando el volumen de pedidos supere los 50 diarios, se recomienda conectar el hook de creación de órdenes con una base de datos ligera como Supabase (PostgreSQL) o Firebase Firestore.
