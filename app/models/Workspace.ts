import { Model } from 'aerojs';
import { WorkspaceMember } from './WorkspaceMember.js';
import { Project } from './Project.js';

export class Workspace extends Model {
  public static override table = 'workspaces';
  public static override primaryKey = 'id';
  public static override fillable = [
    'name',
    'slug',
    'owner_id',
    'logo',
    'plan',
  ];

  public members() {
    return this.hasMany(WorkspaceMember, 'workspace_id', 'id');
  }

  public projects() {
    return this.hasMany(Project, 'workspace_id', 'id');
  }
}
