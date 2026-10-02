import { Model } from 'aerojs';

export class Invitation extends Model {
  public static override table = 'invitations';
  public static override primaryKey = 'id';
  public static override fillable = [
    'workspace_id',
    'email',
    'role',
    'token',
    'accepted_at',
    'expires_at',
  ];
}
