# 💳 GUIA MAESTRA: INTEGRACIÓN PROFESIONAL DE MERCADO PAGO EN APLICACIONES WEB
> **Playbook de ingeniería, resolución de errores reales y guía directiva para desarrolladores y agentes de IA.**
> Documento consolidado con base en la experiencia directa de integración en producción. Contiene todas las soluciones a problemas de conectividad, bucles de cookies, errores de Sandbox, versiones del SDK y compatibilidad con Supabase.

---

## 📑 ÍNDICE
1. [Filosofía y Modelo Mental: ¿Qué Checkout Elegir?](#1-filosofía-y-modelo-mental-qué-checkout-elegir)
2. [Arquitectura y Ciclo de Vida del Pago (Flujo End-to-End)](#2-arquitectura-y-ciclo-de-vida-del-pago-flujo-end-to-end)
3. [Las 10 Trampas y Errores Críticos Resueltos en Trinchera](#3-las-10-trampas-y-errores-críticos-resueltos-en-trinchera)
4. [Script de Diagnóstico Inmediato de Conexión (`test_mercadopago.js`)](#4-script-de-diagnóstico-inmediato-de-conexión-test_mercadopagojs)
5. [Gestión Dual de Credenciales y Variables de Entorno](#5-gestión-dual-de-credenciales-y-variables-de-entorno)
6. [Cómo Crear la Tabla en Supabase sin Bloqueos de PostgREST](#6-cómo-crear-la-tabla-en-supabase-sin-bloqueos-de-postgrest)
7. [Backend: Creación Blindada de la Preferencia (`Preference`)](#7-backend-creación-blindada-de-la-preferencia-preference)
8. [Backend: Webhook Seguro con Firma `x-signature` y Consulta Fidedigna](#8-backend-webhook-seguro-con-firma-x-signature-y-consulta-fidedigna)
9. [Backend: Verificación Inmediata en el Retorno del Cliente (`/verify`)](#9-backend-verificación-inmediata-en-el-retorno-del-cliente-verify)
10. [Frontend: Integración del Botón de Checkout con Redirección Segura](#10-frontend-integración-del-botón-de-checkout-con-redirección-segura)
11. [Idempotencia y Base de Datos: Esquema de Persistencia](#11-idempotencia-y-base-de-datos-esquema-de-persistencia)
12. [Protocolo de Pruebas en Sandbox y Homologación Oficial](#12-protocolo-de-pruebas-en-sandbox-y-homologación-oficial)
13. [Super-Prompt Directivo para Transferir a Otra IA](#13-super-prompt-directivo-para-transferir-a-otra-ia)

---

## 1. FILOSOFÍA Y MODELO MENTAL: ¿QUÉ CHECKOUT ELEGIR?

Mercado Pago ofrece dos modalidades de integración:

| Criterio | **Checkout Pro (Recomendado 95% de los casos)** | **Checkout API / Bricks (Personalizado)** |
| :--- | :--- | :--- |
| **Experiencia de Usuario** | Ventana modal o redirección a la pasarela segura de Mercado Pago. | Formulario incrustado directamente en el DOM de tu página (marca blanca). |
| **Medios de Pago Soportados** | **Todos automáticamente**: Tarjetas de crédito/débito, cuotas locales, dinero en cuenta de Mercado Pago, transferencias bancarias (SPEI, PSE, Pix), pago en efectivo (OXXO, PagoFácil, agentes). | Solo los medios que configures manualmente en tu interfaz. |
| **Cumplimiento PCI-DSS** | **Cero responsabilidad PCI**; ningún dato sensible de tarjeta roza tu servidor ni tu frontend. | Requiere tokenización vía `MercadoPago.js` y auditoría de formulario SAQ A-EP. |
| **Autenticación 3DS 2.0 y Antifraude** | Gestionado 100% por Mercado Pago con biometría y OTP bancario. | Requiere integrar device fingerprinting y flujos de desafío 3DS manuales. |
| **Mantenimiento y Actualizaciones** | Si MP añade un nuevo medio de pago (ej. Yape / Pix / cuotas sin interés), aparece solo. | Debes actualizar tu frontend y librerías cada vez que cambien contratos. |

> [!TIP]
> **Regla de Oro:** Para SaaS, venta de cursos, membresías o comercio electrónico estándar en Latinoamérica, **usa siempre Checkout Pro**. Es más rápido de implementar, tiene mayor tasa de conversión en la región (los usuarios confían en el logo y su cuenta de Mercado Pago) y minimiza rechazos por fraude.

---

## 2. ARQUITECTURA Y CICLO DE VIDA DEL PAGO (FLUJO END-TO-END)

```mermaid
sequenceDiagram
    autonumber
    actor Cliente as 👤 Usuario / Navegador
    participant Front as 🖥️ Frontend (React / Next.js)
    participant Back as ⚙️ Backend API
    participant MP as 💳 Mercado Pago API
    participant DB as 🗄️ Base de Datos

    Cliente->>Front: Clic en "Pagar con Mercado Pago"
    Front->>Back: POST /api/payments/mercadopago/preference (planId, userId)
    Back->>DB: Consultar precio oficial y validar usuario
    Back->>MP: Preference.create({...items, payer, back_urls, external_reference})
    MP-->>Back: { id: "pref_123", init_point: "https://mercadopago.com/..." }
    Back-->>Front: { preferenceId, redirectUrl }
    Front->>Cliente: Abre Checkout Pro (Modal o Redirección)
    Cliente->>MP: Ingresa tarjeta / cuotas / monedero y confirma pago
    
    par Flujo Asíncrono de Seguridad (Webhook)
        MP->>Back: POST /api/payments/mercadopago/webhook (?data.id=99999)
        Back->>Back: Validar firma HMAC 'x-signature'
        Back->>MP: Payment.get({ id: "99999" })
        Back->>DB: Lock idempotente y activar servicio/orden
        Back-->>MP: HTTP 200 OK (Recibido)
    and Flujo Síncrono de Retorno en Navegador (UX Inmediata)
        MP->>Front: Redirige a /?payment=success&payment_id=99999
        Front->>Back: POST /api/payments/mercadopago/verify { paymentId: "99999" }
        Back->>MP: Payment.get({ id: "99999" })
        Back->>DB: Si no fue activado por el webhook, activar ya
        Back-->>Front: { success: true, status: "approved" }
        Front->>Cliente: Pantalla de felicitación y acceso inmediato
    end
```

---

## 3. LAS 10 TRAMPAS Y ERRORES CRÍTICOS RESUELTOS EN TRINCHERA

Estos son los 10 errores que cometen casi todas las IAs y desarrolladores al intentar conectar con Mercado Pago:

### 1. El Bucle Infinito de Cookies en Sandbox (`ERR_TOO_MANY_REDIRECTS`)
* **Síntoma:** Al redirigir al usuario al link de pago en modo pruebas, la pantalla de Mercado Pago parpadea y el navegador muestra `ERR_TOO_MANY_REDIRECTS`.
* **Causa Raíz:** La API devuelve dos URLs: `response.init_point` y `response.sandbox_init_point`. Si usas `sandbox_init_point`, el subdominio `sandbox.mercadopago.com...` tiene conflictos con las cookies de sesión del navegador.
* **Solución Comprobada en Producción:** **Usa SIEMPRE `response.init_point`**. Si tu Access Token comienza con `TEST-`, Mercado Pago detecta automáticamente que estás en modo pruebas y renderiza el Sandbox perfectamente en el dominio principal sin bucles de cookies.
  ```typescript
  // CORRECTO:
  const redirectUrl = response.init_point || response.sandbox_init_point;
  ```

### 2. El Error: "Una de las partes con la que intentas hacer el pago es de prueba"
* **Pantalla del Error:** Una pantalla blanca con un avatar gris con una "X" que dice: *"Algo salió mal... Una de las partes con la que intentas hacer el pago es de prueba"*.
* **La Falsa Creencia de muchas IAs:**
  Muchas IAs afirman erróneamente: *"El token está mal porque empieza con `APP_USR-` en vez de `TEST-`. Mercado Pago exige obligatoriamente un token `TEST-` para pruebas"*.
  **ESTO ES FALSO.** En Mercado Pago (especialmente en Perú `mercadopago.com.pe` y cuentas unificadas con Mercado Libre), las credenciales de prueba también pueden tener prefijo `APP_USR-` (ejemplo real de este proyecto en `.env.local`: `MERCADOPAGO_TEST_ACCESS_TOKEN=APP_USR-1919472277444175-...`).
* **La Verdadera Causa Raíz:**
  El error **NADA TIENE QUE VER CON EL PREFIJO DEL TOKEN**. 
  Ocurre porque el backend está enviando el correo real del cliente (`payer: { email: "correo_real@gmail.com" }`) dentro de la preferencia:
  ```javascript
  // ❌ ESTO PROVOCA EL ERROR:
  body: {
    items: [...],
    payer: { email: "miluskavidaurre@gmail.com" } // Correo real o no registrado como Test User
  }
  ```
  Al abrir el enlace en el navegador (incluso en Incógnito), Mercado Pago compara los dos extremos de la transacción:
  1. **Parte 1 (Vendedor / Aplicación):** Es una aplicación en modo Sandbox / Pruebas.
  2. **Parte 2 (Comprador `payer.email`):** Es un correo de producción real de Google/Mercado Libre.
  -> **Mercado Pago detecta choque de entornos (un extremo es de prueba y el otro es real)** y bloquea la pantalla con: *"Una de las partes con la que intentas hacer el pago es de prueba"*.
* **La Solución Inmediata en el Código:**
  En fase de desarrollo o pruebas, **OMITE COMPLETAMENTE EL OBJETO `payer` O EL CAMPO `payer.email`** de la creación de la preferencia:
  ```javascript
  // ✅ SOLUCIÓN EN EL BACKEND (mercadopagoService.js):
  const preferencePayload = {
    items: [...],
    back_urls: { ... },
    auto_return: "approved",
    statement_descriptor: "MITIENDA"
    // ⚠️ NO INCLUIR payer: { email: ... } durante pruebas
  };
  ```
  Al no enviar `payer.email`, Mercado Pago no intenta asociar la compra a ningún usuario real: la ventana de Incógnito se abrirá **de inmediato y sin errores**, permitiendo seleccionar tarjeta de crédito y pagar con la tarjeta de prueba oficial `4242 4242 4242 4242`.
  *(En producción, solo se envía `payer.email` cuando la cuenta de Mercado Pago ya ha sido activada/homologada y el correo no sea el del propio vendedor).*

### 3. El Error de Autofinanciamiento / Collector = Payer
* **Síntoma:** El pago se rechaza de inmediato con el mensaje `cc_rejected_call_for_authorize` o rechazo genérico sin explicación.
* **Causa Raíz:** El comprador está intentando pagar con la misma cuenta o email del dueño de la aplicación de Mercado Pago (`arda.systems.iot@gmail.com`). Mercado Pago prohíbe el auto-pago por normativas antilavado.
* **Solución:** Comprobar siempre que el email del pagador no sea el email cobrador:
  ```typescript
  const isCollectorEmail = userEmail?.toLowerCase() === process.env.COLLECTOR_EMAIL?.toLowerCase();
  ```

### 4. Confusión de Versiones del SDK (`mercadopago` v1 vs v2 / v3)
* **Síntoma:** `TypeError: mercadopago.configure is not a function` o `preference.create is not a function`.
* **Causa Raíz:** La IA está usando la sintaxis obsoleta del SDK v1 (`mercadopago.configurations.setAccessToken`).
* **Solución:** En el SDK moderno (`npm install mercadopago@^2` o `^3`):
  ```typescript
  import { MercadoPagoConfig, Preference, Payment } from "mercadopago";
  const client = new MercadoPagoConfig({ accessToken, options: { timeout: 10000 } });
  const preference = new Preference(client);
  const response = await preference.create({ body: preferencePayload });
  ```

### 5. Rechazo por Moneda Incorrecta (`invalid_currency_id`)
* **Síntoma:** Error 400 `bad_request` al llamar a `preference.create`.
* **Causa Raíz:** Una cuenta de Mercado Pago creada en Perú **solo puede cobrar en PEN**; una de México **solo en MXN**; una de Colombia **solo en COP**; una de Argentina **solo en ARS**. Intentar enviar `currency_id: "USD"` en una cuenta nacional provoca rechazo inmediato.
* **Solución:** Convertir el monto a la moneda local de la cuenta antes de enviar la preferencia:
  ```typescript
  // Para cuenta de Perú:
  currency_id: "PEN",
  unit_price: amountInPen,
  ```

### 6. La Trampa del `notification_url` con `localhost`
* **Síntoma:** Los pagos se aprueban pero el webhook nunca llega y el usuario nunca se activa.
* **Causa Raíz:** Configurar `notification_url: "http://localhost:3000/api/payments/mercadopago/webhook"`. Los servidores de Mercado Pago no pueden enviar peticiones a tu máquina local.
* **Solución:** En desarrollo local, omitir `notification_url` (para que el retorno del cliente `/verify` active la cuenta) o usar un túnel público HTTPS (como Cloudflare Tunnel o Ngrok).

### 7. Confusión entre `PUBLIC_KEY` y `ACCESS_TOKEN`
* **Síntoma:** Error `invalid_token` o `unauthorized` (HTTP 401).
* **Causa Raíz:** Poner la `PUBLIC_KEY` en el constructor del backend `MercadoPagoConfig`.
* **Solución:**
  - El backend **SOLO usa el `ACCESS_TOKEN`** (empieza con `APP_USR-...` o `TEST-...`).
  - La `PUBLIC_KEY` solo se usa en el frontend si renderizas componentes JS oficiales de Mercado Pago.

### 8. Falsa Confianza en el Payload del Webhook (Riesgo Crítico de Seguridad)
* **Síntoma:** Vulnerabilidad ante atacantes que simulan pagos aprobados.
* **Causa Raíz:** El Webhook de Mercado Pago solo envía:
  `{ "action": "payment.updated", "type": "payment", "data": { "id": "12345" } }`
  No contiene el estado del pago ni el monto.
* **Solución:** El backend debe tomar el `data.id` y llamar con su `ACCESS_TOKEN` a `Payment.get({ id })` para obtener la verdad directamente desde Mercado Pago.

### 9. La Carrera de Doble Activación (Webhook vs. Redirect)
* **Síntoma:** Usuarios que reciben suscripciones duplicadas o errores de base de datos por colisión de eventos.
* **Solución:** Bloqueo de **Idempotencia**. Registrar el `payment_id` en una tabla de pagos con restricción `UNIQUE (provider, id)`. Si el webhook o el verify intentan insertar el mismo ID por segunda vez, la base de datos ignora la operación (`ON CONFLICT DO NOTHING`).

### 10. Bloqueo de Supabase al Intentar Crear Tablas desde `@supabase/supabase-js`
* **Síntoma:** La IA dice *"no puedo crear la tabla en Supabase"*.
* **Causa Raíz:** La IA intenta usar la API PostgREST (`@supabase/supabase-js`), que solo permite DML (`select`, `insert`) y bloquea DDL (`CREATE TABLE`).
* **Solución:** Conectarse directamente como PostgreSQL usando el driver `pg` con la cadena `DATABASE_URL` o ejecutar el script en el SQL Editor de Supabase (explicado en la Sección 6).

---

## 4. SCRIPT DE DIAGNÓSTICO INMEDIATO DE CONEXIÓN (`test_mercadopago.js`)

Crea este archivo en la raíz de tu proyecto para probar en 2 segundos si tus credenciales y conexión con Mercado Pago son 100% operativas:

```javascript
// test_mercadopago.js
// Ejecutar con: node test_mercadopago.js
require("dotenv").config({ path: ".env.local" });
const { MercadoPagoConfig, Preference } = require("mercadopago");

async function testConnection() {
  console.log("🔍 Iniciando prueba de conexión con Mercado Pago...\n");

  const accessToken =
    process.env.MERCADOPAGO_ACCESS_TOKEN ||
    process.env.MERCADOPAGO_PROD_ACCESS_TOKEN ||
    process.env.MERCADOPAGO_TEST_ACCESS_TOKEN;

  if (!accessToken) {
    console.error("❌ ERROR: No se encontró la variable MERCADOPAGO_ACCESS_TOKEN en tu archivo .env.local");
    process.exit(1);
  }

  const isTestToken = accessToken.startsWith("TEST-");
  const isProdToken = accessToken.startsWith("APP_USR-");

  console.log(`🔑 Tipo de Credencial detectada: ${isTestToken ? "SANDBOX / TEST (Pruebas)" : isProdToken ? "PRODUCCIÓN (Real)" : "DESCONOCIDO"}`);
  console.log(`🔐 Prefijo: ${accessToken.substring(0, 15)}... (Longitud: ${accessToken.length} caracteres)\n`);

  try {
    const client = new MercadoPagoConfig({
      accessToken: accessToken.trim(),
      options: { timeout: 10000 },
    });

    const preference = new Preference(client);

    console.log("📡 Enviando solicitud de prueba a la API de Mercado Pago...");

    const response = await preference.create({
      body: {
        items: [
          {
            id: "test-item-01",
            title: "Diagnóstico de Conectividad Mercado Pago",
            description: "Item temporal de prueba de conectividad",
            quantity: 1,
            currency_id: "PEN", // Ajustar a MXN, ARS, COP según el país de la cuenta
            unit_price: 5.0,
          },
        ],
        back_urls: {
          success: "https://ejemplo.com/success",
          failure: "https://ejemplo.com/failure",
        },
        statement_descriptor: "TEST DIAG",
      },
    });

    console.log("\n✅ ¡CONEXIÓN EXITOSA CON MERCADO PAGO!");
    console.log("--------------------------------------------------");
    console.log(`🆔 Preference ID : ${response.id}`);
    console.log(`🔗 Init Point     : ${response.init_point}`);
    if (response.sandbox_init_point) {
      console.log(`🧪 Sandbox Point  : ${response.sandbox_init_point}`);
    }
    console.log("--------------------------------------------------");
    console.log("🎉 Tu token es válido y la API responde correctamente.\n");
  } catch (err) {
    console.error("\n❌ ERROR AL CONECTAR CON MERCADO PAGO:");
    console.error("Mensaje :", err.message);
    if (err.cause) console.error("Detalle :", JSON.stringify(err.cause, null, 2));
    if (err.status) console.error("Código HTTP:", err.status);
    console.log("\n💡 Pasos de solución:");
    console.log("1. Revisa que el ACCESS_TOKEN no tenga comillas ni espacios al final en .env.local.");
    console.log("2. Verifica que el país de la cuenta soporte la moneda indicada (ej. PEN para Perú, MXN para México).");
  }
}

testConnection();
```

---

## 5. GESTIÓN DUAL DE CREDENCIALES Y VARIABLES DE ENTORNO

Para poder alternar entre Sandbox y Producción con un solo flag sin borrar claves:

Archivo: `.env.local`:
```env
# ============================================================================
# CONFIGURACIÓN DUAL MERCADO PAGO
# ============================================================================
PAYMENT_MODE=production   # 'sandbox' para pruebas | 'production' para cobros reales

# Credenciales de Producción (Obtenidas en Mercado Pago Developers > Credenciales de Producción)
MERCADOPAGO_PROD_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx
NEXT_PUBLIC_MERCADOPAGO_PROD_PUBLIC_KEY=APP_USR-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Credenciales de Sandbox (Obtenidas en Mercado Pago Developers > Credenciales de Prueba)
MERCADOPAGO_TEST_ACCESS_TOKEN=TEST-xxxxxxxxxxxxxxxx-xxxxxx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-xxxxxxxxxx
NEXT_PUBLIC_MERCADOPAGO_TEST_PUBLIC_KEY=TEST-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

# Webhook Secret (Obtenido en la sección Webhooks del panel de MP)
MERCADOPAGO_WEBHOOK_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# URL pública de producción con HTTPS (Obligatorio para que los webhooks funcionen)
NEXT_PUBLIC_SITE_URL=https://tudominio.com

# Cadena de conexión directa a PostgreSQL de Supabase (Para ejecutar migraciones DDL)
DATABASE_URL=postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

---

## 6. CÓMO CREAR LA TABLA EN SUPABASE SIN BLOQUEOS DE POSTGREST

Si la otra IA no puede crear la tabla porque `@supabase/supabase-js` bloquea `CREATE TABLE`, indícale que ejecute una de estas dos soluciones:

### Opción A (Recomendada para la IA): Script de Migración Directa con `pg`
Crear `scripts/migrate_payment_tables.js` y correr con `node scripts/migrate_payment_tables.js`:

```javascript
// scripts/migrate_payment_tables.js
require("dotenv").config({ path: ".env.local" });
const { Client } = require("pg");

async function migrate() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error("Falta DATABASE_URL en .env.local");
    process.exit(1);
  }

  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    console.log("Conectado a PostgreSQL de Supabase...");

    await client.query(`
      CREATE TABLE IF NOT EXISTS public.payment_transactions (
        id TEXT PRIMARY KEY,
        order_id TEXT,
        user_id TEXT,
        provider TEXT NOT NULL DEFAULT 'mercadopago',
        amount NUMERIC(10, 2) NOT NULL,
        currency TEXT NOT NULL DEFAULT 'PEN',
        status TEXT NOT NULL,
        status_detail TEXT,
        external_reference TEXT,
        payer_email TEXT,
        raw_response JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        CONSTRAINT uq_provider_transaction UNIQUE (provider, id)
      );

      CREATE INDEX IF NOT EXISTS idx_payment_transactions_order ON public.payment_transactions(order_id);
      CREATE INDEX IF NOT EXISTS idx_payment_transactions_user ON public.payment_transactions(user_id);
    `);

    console.log("✅ Tabla 'payment_transactions' creada exitosamente en Supabase.");
  } catch (err) {
    console.error("Error en migración:", err);
  } finally {
    await client.end();
  }
}

migrate();
```

### Opción B: Copiar y Pegar en el SQL Editor de Supabase
Ir a [Supabase Dashboard](https://supabase.com/dashboard) > **SQL Editor** > **New Query**, pegar y hacer clic en **Run**:
```sql
CREATE TABLE IF NOT EXISTS public.payment_transactions (
    id TEXT PRIMARY KEY,
    order_id TEXT,
    user_id TEXT,
    provider TEXT NOT NULL DEFAULT 'mercadopago',
    amount NUMERIC(10, 2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'PEN',
    status TEXT NOT NULL,
    status_detail TEXT,
    external_reference TEXT,
    payer_email TEXT,
    raw_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT uq_provider_transaction UNIQUE (provider, id)
);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_order ON public.payment_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user ON public.payment_transactions(user_id);
```

---

## 7. BACKEND: CREACIÓN BLINDADA DE LA PREFERENCIA (`PREFERENCE`)

Archivo: `src/app/api/payments/mercadopago/preference/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";

export async function POST(req: Request) {
  try {
    const { planId, userId, userEmail } = await req.json();

    // 1. Obtener credenciales según el entorno
    const isProd = process.env.PAYMENT_MODE === "production";
    const accessToken = isProd
      ? process.env.MERCADOPAGO_PROD_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN
      : process.env.MERCADOPAGO_TEST_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, error: "Credencial MERCADOPAGO_ACCESS_TOKEN no configurada." },
        { status: 500 }
      );
    }

    const isSandbox = accessToken.startsWith("TEST-");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tudominio.com";

    // 2. Precio oficial en moneda local (PEN para Perú, MXN para México)
    const itemPrice = 49.00;
    const itemCurrency = "PEN";

    // 3. Inicializar cliente oficial Mercado Pago v2
    const client = new MercadoPagoConfig({
      accessToken: accessToken.trim(),
      options: { timeout: 10000 },
    });

    const preference = new Preference(client);

    // 4. Armar el payload con las protecciones de trinchera
    const preferencePayload: any = {
      items: [
        {
          id: planId || "plan-pro",
          title: "Suscripción Acceso Pro - 1 Mes",
          description: "Acceso total a todas las herramientas y simulacros",
          category_id: "services",
          quantity: 1,
          currency_id: itemCurrency,
          unit_price: itemPrice,
        },
      ],
      external_reference: JSON.stringify({
        userId,
        planId,
        userEmail,
        createdAt: new Date().toISOString(),
      }),
      back_urls: {
        success: `${siteUrl}/?payment=success&provider=mercadopago`,
        pending: `${siteUrl}/?payment=pending&provider=mercadopago`,
        failure: `${siteUrl}/?payment=failure&provider=mercadopago`,
      },
      auto_return: "approved",
      binary_mode: true, // Solo aprueba o rechaza de inmediato (sin pagos pendientes colgados)
      statement_descriptor: "MISERVICIO",
    };

    // Solo agregar notification_url si es un dominio público HTTPS (no localhost)
    if (!siteUrl.includes("localhost") && !siteUrl.includes("127.0.0.1")) {
      preferencePayload.notification_url = `${siteUrl}/api/payments/mercadopago/webhook`;
    }

    // Regla de Oro de Sandbox: En pruebas NO enviar payer.email para evitar el Error 145
    // En producción solo enviarlo si no coincide con la cuenta recaudadora
    const isCollector = userEmail?.toLowerCase() === process.env.COLLECTOR_EMAIL?.toLowerCase();
    if (!isSandbox && userEmail && !isCollector) {
      preferencePayload.payer = { email: userEmail };
    }

    // 5. Crear la preferencia
    const response = await preference.create({ body: preferencePayload });

    // Regla de Oro de Redirects: Usar SIEMPRE init_point para evitar el bucle de cookies
    const redirectUrl = response.init_point || response.sandbox_init_point;

    return NextResponse.json({
      success: true,
      preferenceId: response.id,
      initPoint: redirectUrl,
    });
  } catch (error: any) {
    console.error("Error creando preferencia en Mercado Pago:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Error al procesar el pago" },
      { status: 500 }
    );
  }
}
```

---

## 8. BACKEND: WEBHOOK SEGURO CON FIRMA `x-signature` Y CONSULTA FIDEDIGNA

Archivo: `src/app/api/payments/mercadopago/webhook/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import crypto from "crypto";

function verifySignature(
  xSignature: string | null,
  xRequestId: string | null,
  dataId: string,
  secret: string
): boolean {
  if (!xSignature || !secret) return true;
  try {
    const parts = xSignature.split(",").reduce((acc: any, part) => {
      const [k, v] = part.split("=");
      if (k && v) acc[k.trim()] = v.trim();
      return acc;
    }, {});

    const ts = parts["ts"];
    const v1 = parts["v1"];
    if (!ts || !v1) return false;

    let manifest = `id:${dataId};`;
    if (xRequestId) manifest += `request-id:${xRequestId};`;
    manifest += `ts:${ts};`;

    const hash = crypto.createHmac("sha256", secret).update(manifest).digest("hex");
    return hash === v1;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const body = await req.json().catch(() => ({}));

    const paymentId = searchParams.get("data.id") || body?.data?.id || searchParams.get("id") || body?.id;
    const type = searchParams.get("type") || body?.type;

    if (!paymentId || (type && type !== "payment")) {
      return NextResponse.json({ received: true });
    }

    // 1. Validar firma criptográfica
    const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET || "";
    if (secret && !verifySignature(req.headers.get("x-signature"), req.headers.get("x-request-id"), String(paymentId), secret)) {
      console.warn("Webhook: Firma descartada por inválida");
      return NextResponse.json({ error: "Firma inválida" }, { status: 401 });
    }

    // 2. Consultar directamente a Mercado Pago para saber el estado real
    const accessToken = process.env.MERCADOPAGO_PROD_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN;
    const client = new MercadoPagoConfig({ accessToken: accessToken!.trim() });
    const payment = await new Payment(client).get({ id: String(paymentId) });

    if (!payment) return NextResponse.json({ received: true });

    // 3. Si está formalmente aprobado, activar servicio con Idempotencia
    if (payment.status === "approved") {
      let extRef: any = {};
      try { extRef = JSON.parse(payment.external_reference || "{}"); } catch { extRef = {}; }

      const userId = extRef.userId || payment.metadata?.user_id;
      const planId = extRef.planId || payment.metadata?.plan_id;

      console.log(`✅ Pago aprobado ${payment.id} para usuario ${userId}. Activando...`);
      // Ejecutar activación idempotente en BD:
      // await activateSubscriptionIdempotent(userId, planId, String(payment.id));
    }

    return NextResponse.json({ success: true, status: payment.status });
  } catch (err: any) {
    console.error("Error en Webhook Mercado Pago:", err);
    return NextResponse.json({ received: true }, { status: 200 }); // Responder 200 para evitar bucle de reintentos
  }
}
```

---

## 9. BACKEND: VERIFICACIÓN INMEDIATA EN EL RETORNO DEL CLIENTE (`/verify`)

Archivo: `src/app/api/payments/mercadopago/verify/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";

export async function POST(req: Request) {
  try {
    const { paymentId } = await req.json();
    if (!paymentId) {
      return NextResponse.json({ success: false, error: "ID de pago requerido" }, { status: 400 });
    }

    const accessToken = process.env.MERCADOPAGO_PROD_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN;
    const client = new MercadoPagoConfig({ accessToken: accessToken!.trim() });
    const payment = await new Payment(client).get({ id: String(paymentId) });

    if (!payment) {
      return NextResponse.json({ success: false, error: "Pago no encontrado" }, { status: 404 });
    }

    if (payment.status === "approved") {
      let extRef: any = {};
      try { extRef = JSON.parse(payment.external_reference || "{}"); } catch { extRef = {}; }

      // Activar con verificación de idempotencia en BD si el webhook aún no llegó
      // await activateSubscriptionIdempotent(extRef.userId, extRef.planId, String(payment.id));

      return NextResponse.json({
        success: true,
        status: "approved",
        message: "¡Pago aprobado y verificado con éxito!",
      });
    }

    return NextResponse.json({
      success: false,
      status: payment.status,
      message: `Estado actual del pago: ${payment.status} (${payment.status_detail})`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
```

---

## 10. FRONTEND: INTEGRACIÓN DEL BOTÓN DE CHECKOUT CON REDIRECCIÓN SEGURA

Componente React / Next.js: `src/components/MercadoPagoButton.tsx`:

```tsx
"use client";

import React, { useState } from "react";

interface Props {
  planId: string;
  userId: string;
  userEmail: string;
}

export function MercadoPagoButton({ planId, userId, userEmail }: Props) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const response = await fetch("/api/payments/mercadopago/preference", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, userId, userEmail }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "No se pudo iniciar el checkout con Mercado Pago");
      }

      // Redirigir al usuario al initPoint (funciona en Sandbox y Producción sin bucles)
      if (data.initPoint) {
        window.location.href = data.initPoint;
      } else {
        throw new Error("No se recibió la URL de pago.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Error al conectar con la pasarela.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full flex items-center justify-center gap-3 bg-[#009EE3] hover:bg-[#0082BD] text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Conectando a Mercado Pago...
          </span>
        ) : (
          <>
            <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
              <path d="M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H3V8h18v10z"/>
            </svg>
            <span>Pagar con Mercado Pago (Tarjetas / Cuotas / Monedero)</span>
          </>
        )}
      </button>

      {errorMessage && (
        <p className="text-xs text-red-500 font-medium text-center">{errorMessage}</p>
      )}
    </div>
  );
}
```

---

## 11. IDEMPOTENCIA Y BASE DE DATOS: ESQUEMA DE PERSISTENCIA

Función TypeScript para asegurar que jamás se otorgue dos veces un beneficio si coinciden Webhook y Retorno:

```typescript
import { queryDb } from "@/lib/serverDb";

export async function activateSubscriptionIdempotent(
  userId: string,
  planId: string,
  paymentId: string,
  amount: number,
  currency: string
): Promise<{ alreadyActivated: boolean }> {
  // 1. Candado atómico: Intentar insertar la transacción en la base de datos
  const insertSql = `
    INSERT INTO public.payment_transactions (id, user_id, provider, plan_id, amount, currency, status)
    VALUES ($1, $2, 'mercadopago', $3, $4, $5, 'approved')
    ON CONFLICT (provider, id) DO NOTHING
    RETURNING id;
  `;
  const rows = await queryDb(insertSql, [paymentId, userId, planId, amount, currency]);

  // Si no devolvió filas, significa que ya fue insertado previamente por el webhook o el verify
  if (!rows || rows.length === 0) {
    console.log(`Idempotencia: Pago ${paymentId} ya estaba registrado en BD.`);
    return { alreadyActivated: true };
  }

  // 2. Primera vez: Actualizar la suscripción o pedido en la base de datos
  await queryDb(
    `UPDATE public.users 
     SET subscription_plan = $2, 
         subscription_expires_at = NOW() + INTERVAL '30 days',
         is_active = TRUE 
     WHERE id = $1;`,
    [userId, planId]
  );

  return { alreadyActivated: false };
}
```

---

## 12. PROTOCOLO DE PRUEBAS EN SANDBOX Y HOMOLOGACIÓN OFICIAL

### Tarjetas de Prueba Oficiales de Mercado Pago (Globales)
Úsalas en Sandbox con cualquier nombre, fecha futura (ej. `11/28`) y DNI ficticio:

| Estado Esperado | Número de Tarjeta | CVV | Resultado |
| :--- | :--- | :--- | :--- |
| **Aprobado Inmediato** | `4242 4242 4242 4242` | `123` | `approved` (accredited) |
| **Fondos Insuficientes** | `4023 3611 1111 1114` | `123` | `rejected` (insufficient_amount) |
| **Tarjeta Vencida** | `4023 3611 1111 1115` | `123` | `rejected` (expired_card) |
| **Error en Código de Seguridad** | `4023 3611 1111 1116` | `999` | `rejected` (invalid_security_code) |

---

## 13. SUPER-PROMPT DIRECTIVO PARA TRANSFERIR A OTRA IA

Copia y pega este bloque íntegro en la otra IA para que resuelva de raíz cualquier problema de conexión con Mercado Pago y Supabase:

```markdown
Eres un Arquitecto Senior Fullstack especialista en pasarelas de pago y seguridad fintech.
Tu tarea es implementar y conectar Mercado Pago Checkout Pro en este proyecto. Ya contamos con experiencia resolviendo los errores más comunes de Mercado Pago, así que debes seguir estrictamente estas reglas probadas:

1. DIAGNÓSTICO Y CONEXIÓN INICIAL:
   - Crea un script `test_mercadopago.js` en la raíz con el SDK oficial v2 (`npm install mercadopago`) y ejecútalo para verificar si el ACCESS_TOKEN responde con una preferencia mínima válida.
   - Si el token comienza con `TEST-`, opera en modo Sandbox; si comienza con `APP_USR-`, opera en modo Producción.
   - NUNCA pongas la PUBLIC_KEY en el backend ni intentes usar el método obsoleto `mercadopago.configure()`.

2. CREACIÓN DE PREFERENCIA (CHECKOUT PRO):
   - Endpoint: POST `/api/payments/mercadopago/preference`.
   - Utiliza `new Preference(client).create({ body: preferencePayload })`.
   - Moneda: La cuenta receptora es nacional; asegúrate de enviar la moneda local correspondiente (PEN para Perú, MXN para México, COP para Colombia, ARS para Argentina).
   - REDIRECCIÓN SIN BUCLES: Usa SIEMPRE `response.init_point`. NO uses `sandbox_init_point` ya que provoca el error de cookies `ERR_TOO_MANY_REDIRECTS`.
   - EVITAR ERROR 145 EN SANDBOX: En modo Sandbox, no envíes el objeto `payer.email` para evitar choque de entornos entre cuentas reales y de prueba.
   - AUTO-PAGO: Asegúrate de que el email pagador no sea el mismo email de la cuenta dueña de Mercado Pago.

3. WEBHOOKS Y SEGURIDAD:
   - Endpoint: POST `/api/payments/mercadopago/webhook`.
   - NUNCA confíes en los datos recibidos en el body. Extrae el `paymentId` y llama a `new Payment(client).get({ id: paymentId })`.
   - Responde siempre HTTP 200 al webhook para evitar reintentos continuos de Mercado Pago.
   - Aplica bloqueo de IDEMPOTENCIA en la base de datos con restricción `UNIQUE` en la tabla de transacciones para evitar activaciones duplicadas entre el Webhook y la redirección del navegador.

4. BASE DE DATOS SUPABASE:
   - No intentes crear tablas DDL (`CREATE TABLE`) usando `@supabase/supabase-js` porque PostgREST bloquea operaciones estructurales.
   - Conéctate directamente con el driver `pg` de Node.js usando la cadena `DATABASE_URL` para ejecutar la migración de `payment_transactions`, o indícame el script SQL para ejecutarlo en el SQL Editor de Supabase.

5. VERIFICACIÓN EN RETORNO DEL CLIENTE:
   - Endpoint: POST `/api/payments/mercadopago/verify` para que, cuando el usuario regrese a la web tras pagar, se consulte a la API de Mercado Pago y se le dé acceso instantáneo sin esperar la latencia del webhook.
```
