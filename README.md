# Salón & Estilo — Miluska Vidaurre

Plataforma web integral de alta gama para salón de belleza, estética capilar y boutique de cosmética profesional en Chiclayo, Lambayeque - Perú.

---

## 🚀 Despliegue en Vivo
* **URL en Vercel:** [https://salon-y-estilo.vercel.app](https://salon-y-estilo.vercel.app)
* **Repositorio GitHub:** [ardasystems/salon-y-estilo](https://github.com/ardasystems/salon-y-estilo)
* **Base de Datos & Backend:** Supabase Cloud (`fmjnmjkzbbqmldgnmwvz`)

---

## ✨ Características Principales

1. **Diseño Dark Luxury & Mobile-First:**
   - Estética oscura de lujo con acentos dorados (`#D4AF37`), tipografía premium (*Cormorant Garamond* y *Plus Jakarta Sans*) y diseño completamente adaptable a pantallas móviles.
   - Selector dinámico de forma para el logotipo (circular o cuadrado con bordes pulidos).
   - Transiciones visuales suaves y optimizadas para celulares.

2. **Sincronización en la Nube Multi-dispositivo (Supabase):**
   - Todos los cambios administrativos (logotipo, forma de logo, datos de contacto, productos, servicios, precios, casos antes/después) se guardan en Supabase (PostgreSQL 15) y se sincronizan en tiempo real con todas las computadoras, celulares y ventanas incógnito abiertas.
   - Soporte para subida y almacenamiento de imágenes en el bucket CDN `salon-assets`.

3. **Flujo de Compra Peruano Adaptado:**
   - Métodos de pago locales: **Yape**, **Plin**, tarjetas y pasarelas digitales.
   - Carga y compresión automática de comprobantes de pago (vouchers).
   - Generación instantánea de comprobante de pago oficial en PDF (`jsPDF`).
   - Envío de pedido estructurado a WhatsApp oficial del salón con un solo clic.

4. **Panel de Administración Completo (`AdminDashboard.jsx`):**
   - Gestión de catálogo de productos (creación, edición, eliminación, stock, precios, palabras clave).
   - Gestión de servicios de peluquería y estética.
   - Casos interactivos de "Antes & Después".
   - Control de pedidos, visualización de vouchers de pago y métricas de ventas.
   - Configuración global de la tienda (logotipo, QR de Yape/Plin, redes sociales, costos de envío para Chiclayo, Pimentel y agencias nacionales Shalom/Olva).

---

## 🛠️ Tecnologías Utilizadas

- **Frontend:** React 19, Vite 8, Vanilla CSS moderno (Tokens HSL).
- **Backend / Database:** Supabase (PostgreSQL 15, Supabase Realtime, Supabase Storage).
- **Herramientas:** `@supabase/supabase-js`, `lucide-react`, `jspdf`, `canvas-confetti`.
- **Despliegue:** Vercel con rewrites SPA (`vercel.json`).

---

## 💻 Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/ardasystems/salon-y-estilo.git
   cd salon-y-estilo
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno (`.env`):**
   ```env
   VITE_SUPABASE_URL=https://fmjnmjkzbbqmldgnmwvz.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_6uMUfL82MQQiwtt-h2lmkQ_LY4mHND3
   ```

4. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre en tu navegador `http://localhost:5173`.

5. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 📄 Documentación Adicional
- [Plan de Negocio Digital](PLAN_DE_NEGOCIO.md)
- [Arquitectura y Configuración Técnica](ARQUITECTURA_Y_CONFIGURACION_TECNICA.md)
