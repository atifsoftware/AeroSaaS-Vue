import { Aero, vite, serveStatic } from 'aerojs';
import { registerWebRoutes } from './routes/web.js';
import { registerApiRoutes } from './routes/api.js';
import * as path from 'node:path';
import * as fs from 'node:fs';

const storageDir = path.resolve('storage');
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

const app = new Aero({
  port: Number(process.env.PORT || 3001),
  debug: process.env.APP_ENV !== 'production',
});

const dbPath = path.resolve('storage/database.sqlite');
app.useSqlite(dbPath);

app.use(serveStatic({ root: 'public' }));

app.useInertia({
  rootView: `
    <!DOCTYPE html>
    <html lang="en" class="dark">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AeroSaaS (Vue 3) — High-Performance Project Engine</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
        ${vite('resources/js/app.ts')}
      </head>
      <body class="bg-[#0B0F17] text-gray-100 antialiased selection:bg-indigo-500 selection:text-white min-h-screen">
        @inertia
      </body>
    </html>
  `,
  version: '1.0',
});

app.useSwagger({
  title: 'AeroSaaS Vue Platform API',
  version: '1.0.0',
  description: 'REST API documentation for AeroSaaS Vue 3 Edition',
  route: '/docs',
  specRoute: '/openapi.json',
});

registerWebRoutes(app.router);
registerApiRoutes(app.router);

const port = Number(process.env.PORT || 3001);
app.listen(port, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 AeroSaaS (Vue 3) running at: http://localhost:${port}`);
  console.log(`📚 Interactive Swagger API Docs: http://localhost:${port}/docs`);
  console.log(`======================================================\n`);
});

export default app;
