import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

function mercadoPagoDevPlugin() {
  return {
    name: 'mercadopago-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const urlObj = new URL(req.url, 'http://localhost:5173');
        const pathname = urlObj.pathname;
        if (!pathname.startsWith('/api/payments/mercadopago')) {
          return next();
        }

        // Helper to send json and status
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };

        // Parse query params
        req.query = Object.fromEntries(urlObj.searchParams.entries());

        // Parse body if present
        let bodyData = '';
        req.on('data', chunk => { bodyData += chunk; });
        req.on('end', async () => {
          try {
            req.body = bodyData ? JSON.parse(bodyData) : {};
          } catch {
            req.body = {};
          }

          try {
            if (pathname.includes('/preference')) {
              const { default: handler } = await import('./api/payments/mercadopago/preference.js');
              await handler(req, res);
            } else if (pathname.includes('/webhook')) {
              const { default: handler } = await import('./api/payments/mercadopago/webhook.js');
              await handler(req, res);
            } else if (pathname.includes('/verify')) {
              const { default: handler } = await import('./api/payments/mercadopago/verify.js');
              await handler(req, res);
            } else {
              res.status(404).json({ error: 'Endpoint no encontrado' });
            }
          } catch (err) {
            console.error('[Vite MP Dev Server Error]', err);
            res.status(500).json({ success: false, error: err.message });
          }
        });
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  // Expose to process.env for Node server runtime
  Object.assign(process.env, env);

  return {
    plugins: [react(), mercadoPagoDevPlugin()],
    server: {
      host: true,
      port: 5173
    }
  };
});
