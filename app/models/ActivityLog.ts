import { Model } from 'aerojs';
import { User } from './User.js';

export class ActivityLog extends Model {
  public static override table = 'activity_logs';
  public static override primaryKey = 'id';
  public static override fillable = [
    'workspace_id',
    'user_id',
    'action',
    'details',
    'entity_type',
    'entity_id',
  ];

  public user() {
    return this.belongsTo(User, 'user_id', 'id');
  }
}
