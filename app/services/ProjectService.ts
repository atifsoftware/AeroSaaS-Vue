import { DB } from 'aerojs';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { ActivityLog } from '../models/ActivityLog.js';

export class ProjectService {
  public async list(workspaceId: number) {
    const projects = await Project.where('workspace_id', workspaceId).orderBy('created_at', 'DESC').get();
    return Promise.all(
      projects.map(async (p: any) => {
        const tasks = await Task.where('project_id', p.id).get();
        const done = tasks.filter((t: any) => t.status === 'done').length;
        const progress = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0;
        return {
          ...p,
          taskCount: tasks.length,
          completedCount: done,
          progress,
        };
      })
    );
  }

  public async findWithKanban(projectId: number, workspaceId: number) {
    const project = await Project.where('id', projectId).where('workspace_id', workspaceId).first();
    if (!project) return null;

    // Fetch tasks with assignee details
    const tasks = await DB.table('tasks')
      .select('tasks.*', 'users.name as assignee_name', 'users.avatar as assignee_avatar')
      .leftJoin('users', 'tasks.assignee_id', 'users.id')
      .where('tasks.project_id', projectId)
      .orderBy('tasks.position', 'ASC')
      .get();

    return {
      project,
      tasks,
    };
  }

  public async create(workspaceId: number, userId: number, data: { name: string; description?: string; color?: string }) {
    const project = await Project.create({
      workspace_id: workspaceId,
      name: data.name,
      description: data.description || '',
      color: data.color || '#6366F1',
      status: 'active',
    });

    await ActivityLog.create({
      workspace_id: workspaceId,
      user_id: userId,
      action: 'created_project',
      details: `Created project "${project.name}"`,
      entity_type: 'project',
      entity_id: project.id,
    });

    return project;
  }
}
