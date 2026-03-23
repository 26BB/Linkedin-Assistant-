import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import bodyParser from 'body-parser'

// Custom plugin to serve our Vercel functions during local development
// This way users don't need the Vercel CLI locally
function vercelApiPlugin() {
  return {
    name: 'vercel-api-plugin',
    configureServer(server) {
      server.middlewares.use(bodyParser.json());

      server.middlewares.use(async (req, res, next) => {
        if (req.url.startsWith('/api/linkedin-token')) {
          try {
            const handler = await import('./api/linkedin-token.js');
            // req and res emulate express somewhat, enough for Vercel functions
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };
            await handler.default(req, res);
          } catch (err) {
            console.error(err);
            res.statusCode = 500;
            res.end('Internal Server Error');
          }
        } else if (req.url.startsWith('/api/linkedin-proxy')) {
          try {
            const handler = await import('./api/linkedin-proxy.js');
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };
            await handler.default(req, res);
          } catch (err) {
            console.error(err);
            res.statusCode = 500;
            res.end('Internal Server Error');
          }
        } else {
          next();
        }
      });
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 1600,
  },

  plugins: [react(), vercelApiPlugin()],
  server: {
    port: 5173,
    strictPort: true,
  }
})
