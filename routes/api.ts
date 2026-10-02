import type { Router } from 'aerojs';
import { TaskService } from '../app/services/TaskService.js';
import { ProjectService } from '../app/services/ProjectService.js';

export function registerApiRoutes(router: Router): void {
  const taskService = new TaskService();
  const projectService = new ProjectService();

  router.group('/api/v1', (api) => {
    // Health Check
    api.get('/health', async (ctx) => {
      ctx.json({
        status: 'healthy',
        platform: 'AeroSaaS',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      });
    });

    // Public Stats API
    api.get('/stats', async (ctx) => {
      ctx.json({
        version: '1.0.0',
        engine: 'AeroJS High-Throughput Node.js Core',
      });
    });
  });
}
