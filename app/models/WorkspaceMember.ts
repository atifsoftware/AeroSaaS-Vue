import { Model } from 'aerojs';
import { User } from './User.js';
import { Workspace } from './Workspace.js';

export class WorkspaceMember extends Model {
  public static override table = 'workspace_members';
  public static override primaryKey = 'id';
  public static override fillable = [
    'workspace_id',
    'user_id',
    'role',
  ];

  public user() {
    return this.belongsTo(User, 'user_id', 'id');
  }

  public workspace() {
    return this.belongsTo(Workspace, 'workspace_id', 'id');
  }
}
