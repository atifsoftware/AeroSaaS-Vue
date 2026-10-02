import { DB } from 'aerojs';
import { Project } from '../models/Project.js';
import { Task } from '../models/Task.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { WorkspaceMember } from '../models/WorkspaceMember.js';

export class DashboardService {
  public async getMetrics(workspaceId: number) {
    const totalProjects = await Project.where('workspace_id', workspaceId).count();
    const totalTasks = await Task.where('workspace_id', workspaceId).count();
    const completedTasks = await Task.where('workspace_id', workspaceId).where('status', 'done').count();
    const inProgressTasks = await Task.where('workspace_id', workspaceId).where('status', 'in_progress').count();

    const teamMembersCount = await WorkspaceMember.where('workspace_id', workspaceId).count();

    // Priority breakdown
    const urgentCount = await Task.where('workspace_id', workspaceId).where('priority', 'urgent').count();
    const highCount = await Task.where('workspace_id', workspaceId).where('priority', 'high').count();
    const mediumCount = await Task.where('workspace_id', workspaceId).where('priority', 'medium').count();
    const lowCount = await Task.where('workspace_id', workspaceId).where('priority', 'low').count();

    // Recent activity logs with user info
    const logs = await DB.table('activity_logs')
      .select('activity_logs.*', 'users.name as user_name', 'users.avatar as user_avatar')
      .leftJoin('users', 'activity_logs.user_id', 'users.id')
      .where('activity_logs.workspace_id', workspaceId)
      .orderBy('activity_logs.created_at', 'DESC')
      .limit(6)
      .get();

    // Projects summary with task counts
    const projects = await Project.where('workspace_id', workspaceId).get();
    const projectSummaries = await Promise.all(
      projects.map(async (p: any) => {
        const pTasks = await Task.where('project_id', p.id).get();
        const done = pTasks.filter((t: any) => t.status === 'done').length;
        const progress = pTasks.length > 0 ? Math.round((done / pTasks.length) * 100) : 0;
        return {
          id: p.id,
          name: p.name,
          color: p.color,
          description: p.description,
          totalTasks: pTasks.length,
          completedTasks: done,
          progress,
        };
      })
    );

    return {
      stats: {
        totalProjects,
        totalTasks,
        completedTasks,
        inProgressTasks,
        teamMembersCount,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      },
      priorityDistribution: {
        urgent: urgentCount,
        high: highCount,
        medium: mediumCount,
        low: lowCount,
      },
      projectSummaries,
      recentActivities: logs,
    };
  }
}
