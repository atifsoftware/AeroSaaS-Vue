import { Model } from 'aerojs';
import { WorkspaceMember } from './WorkspaceMember.js';

export class User extends Model {
  public static override table = 'users';
  public static override primaryKey = 'id';
  public static override fillable = [
    'name',
    'email',
    'password',
    'avatar',
    'current_workspace_id',
    'two_factor_secret',
    'two_factor_enabled',
  ];
  public static override hidden = ['password', 'two_factor_secret'];
  public static override softDeletes = true;

  public memberships() {
    return this.hasMany(WorkspaceMember, 'user_id', 'id');
  }
}
