import { Model } from 'aerojs';
import { Project } from './Project.js';
import { User } from './User.js';

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export class Task extends Model {
  public static override table = 'tasks';
  public static override primaryKey = 'id';
  public static override fillable = [
    'project_id',
    'workspace_id',
    'title',
    'description',
    'status',
    'priority',
    'assignee_id',
    'due_date',
    'position',
  ];

  public project() {
    return this.belongsTo(Project, 'project_id', 'id');
  }

  public assignee() {
    return this.belongsTo(User, 'assignee_id', 'id');
  }
}
