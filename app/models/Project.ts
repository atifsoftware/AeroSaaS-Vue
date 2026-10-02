import { Model } from 'aerojs';
import { Workspace } from './Workspace.js';
import { Task } from './Task.js';

export class Project extends Model {
  public static override table = 'projects';
  public static override primaryKey = 'id';
  public static override fillable = [
    'workspace_id',
    'name',
    'description',
    'color',
    'status',
  ];

  public workspace() {
    return this.belongsTo(Workspace, 'workspace_id', 'id');
  }

  public tasks() {
    return this.hasMany(Task, 'project_id', 'id');
  }
}
