import type { Router } from 'aerojs';
import { AuthController } from '../app/controllers/AuthController.js';
import { DashboardController } from '../app/controllers/DashboardController.js';
import { ProjectController } from '../app/controllers/ProjectController.js';
import { TaskController } from '../app/controllers/TaskController.js';
import { TeamController } from '../app/controllers/TeamController.js';
import { ProfileController } from '../app/controllers/ProfileController.js';
import { authMiddleware } from '../app/middleware/AuthMiddleware.js';

export function registerWebRoutes(router: Router): void {
  // Public Landing / Auth Routes
  router.get('/', (ctx) => {
    if (ctx.cookies['user_id']) {
      ctx.redirect('/dashboard');
    } else {
      ctx.redirect('/login');
    }
  });

  router.get('/login', [AuthController, 'showLogin']);
  router.post('/login', [AuthController, 'login']);
  router.get('/register', [AuthController, 'showRegister']);
  router.post('/register', [AuthController, 'register']);
  router.post('/logout', [AuthController, 'logout']);
  router.get('/logout', [AuthController, 'logout']);

  // Protected SaaS Application Routes
  router.group('', (app) => {
    app.middleware(authMiddleware);

    // Dashboard
    app.get('/dashboard', [DashboardController, 'index']);

    // Projects
    app.get('/projects', [ProjectController, 'index']);
    app.post('/projects', [ProjectController, 'store']);
    app.get('/projects/:id', [ProjectController, 'show']);

    // Tasks & Kanban
    app.get('/tasks', [TaskController, 'index']);
    app.post('/tasks', [TaskController, 'store']);
    app.post('/tasks/:id/status', [TaskController, 'updateStatus']);
    app.delete('/tasks/:id', [TaskController, 'destroy']);

    // Team & Settings
    app.get('/settings/team', [TeamController, 'index']);
    app.post('/settings/team/invite', [TeamController, 'invite']);
    app.get('/settings/profile', [ProfileController, 'index']);
    app.post('/settings/profile', [ProfileController, 'update']);
  });
}
