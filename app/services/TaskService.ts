import { DB } from 'aerojs';
import { Task, type TaskStatus, type TaskPriority } from '../models/Task.js';
import { ActivityLog } from '../models/ActivityLog.js';

export class TaskService {
  public async listForWorkspace(workspaceId: number) {
    return DB.table('tasks')
      .select('tasks.*', 'projects.name as project_name', 'projects.color as project_color', 'users.name as assignee_name', 'users.avatar as assignee_avatar')
      .leftJoin('projects', 'tasks.project_id', 'projects.id')
      .leftJoin('users', 'tasks.assignee_id', 'users.id')
      .where('tasks.workspace_id', workspaceId)
      .orderBy('tasks.created_at', 'DESC')
      .get();
  }

  public async create(
    workspaceId: number,
    userId: number,
    data: {
      project_id: number;
      title: string;
      description?: string;
      status?: TaskStatus;
      priority?: TaskPriority;
      assignee_id?: number | null;
      due_date?: string | null;
    }
  ) {
    const highestTask = await DB.table('tasks')
      .where('project_id', data.project_id)
      .where('status', data.status || 'todo')
      .orderBy('position', 'DESC')
      .first();

    const position = (highestTask?.position || 0) + 1;

    const task = await Task.create({
      project_id: Number(data.project_id),
      workspace_id: workspaceId,
      title: data.title,
      description: data.description || '',
      status: data.status || 'todo',
      priority: data.priority || 'medium',
      assignee_id: data.assignee_id ? Number(data.assignee_id) : null,
      due_date: data.due_date || null,
      position,
    });

    await ActivityLog.create({
      workspace_id: workspaceId,
      user_id: userId,
      action: 'created_task',
      details: `Created task "${task.title}"`,
      entity_type: 'task',
      entity_id: task.id,
    });

    return task;
  }

  public async updateStatus(taskId: number, newStatus: TaskStatus, newPosition: number, userId: number, workspaceId: number) {
    const task = await Task.find(taskId);
    if (!task) return null;

    const oldStatus = task.status;
    task.status = newStatus;
    task.position = newPosition;
    await task.save();

    if (oldStatus !== newStatus) {
      await ActivityLog.create({
        workspace_id: workspaceId,
        user_id: userId,
        action: 'moved_task',
        details: `Moved "${task.title}" to ${newStatus.replace('_', ' ')}`,
        entity_type: 'task',
        entity_id: task.id,
      });
    }

    return task;
  }

  public async delete(taskId: number, userId: number, workspaceId: number) {
    const task = await Task.find(taskId);
    if (!task) return false;

    const title = task.title;
    await task.delete();

    await ActivityLog.create({
      workspace_id: workspaceId,
      user_id: userId,
      action: 'deleted_task',
      details: `Deleted task "${title}"`,
      entity_type: 'task',
      entity_id: taskId,
    });

    return true;
  }
}
