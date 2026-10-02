import type { AeroContext } from 'aerojs';
import { TaskService } from '../services/TaskService.js';
import { ProjectService } from '../services/ProjectService.js';
import { TeamService } from '../services/TeamService.js';

export class TaskController {
  private taskService = new TaskService();
  private projectService = new ProjectService();
  private teamService = new TeamService();

  public async index(ctx: AeroContext): Promise<void> {
    const user = ctx.state.user;
    const workspace = ctx.state.workspace;

    const tasks = await this.taskService.listForWorkspace(workspace.id);
    const projects = await this.projectService.list(workspace.id);
    const teamMembers = await this.teamService.getMembers(workspace.id);

    await ctx.inertia.render('Tasks/Index', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      workspace: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
      },
      tasks,
      projects,
      teamMembers,
    });
  }

  public async store(ctx: AeroContext): Promise<void> {
    const user = ctx.state.user;
    const workspace = ctx.state.workspace;
    const payload = ctx.body as any;

    if (!payload.title || !payload.project_id) {
      ctx.status(422).json({ error: 'Title and Project ID are required' });
      return;
    }

    const task = await this.taskService.create(workspace.id, user.id, {
      project_id: Number(payload.project_id),
      title: payload.title.trim(),
      description: payload.description,
      status: payload.status,
      priority: payload.priority,
      assignee_id: payload.assignee_id ? Number(payload.assignee_id) : null,
      due_date: payload.due_date,
    });

    if (ctx.req.headers['x-inertia']) {
      ctx.redirect(ctx.req.headers['referer'] || `/projects/${payload.project_id}`);
      return;
    }

    ctx.status(201).json({ success: true, task });
  }

  public async updateStatus(ctx: AeroContext): Promise<void> {
    const user = ctx.state.user;
    const workspace = ctx.state.workspace;
    const taskId = Number(ctx.req.params.id);
    const { status, position } = ctx.body as any;

    const task = await this.taskService.updateStatus(
      taskId,
      status,
      position !== undefined ? Number(position) : 0,
      user.id,
      workspace.id
    );

    if (!task) {
      ctx.status(404).json({ error: 'Task not found' });
      return;
    }

    // Broadcast WebSocket event if Aero WebSocket hub is available
    if ((globalThis as any).__AERO_WS_HUB__) {
      (globalThis as any).__AERO_WS_HUB__.broadcast(`workspace:${workspace.id}`, {
        event: 'task_updated',
        task,
      });
    }

    ctx.status(200).json({ success: true, task });
  }

  public async destroy(ctx: AeroContext): Promise<void> {
    const user = ctx.state.user;
    const workspace = ctx.state.workspace;
    const taskId = Number(ctx.req.params.id);

    await this.taskService.delete(taskId, user.id, workspace.id);

    if (ctx.req.headers['x-inertia']) {
      ctx.redirect(ctx.req.headers['referer'] || '/projects');
      return;
    }

    ctx.status(200).json({ success: true });
  }
}
