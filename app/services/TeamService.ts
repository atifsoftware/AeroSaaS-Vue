import { DB, UrlSigner } from 'aerojs';
import { WorkspaceMember } from '../models/WorkspaceMember.js';
import { Invitation } from '../models/Invitation.js';
import { User } from '../models/User.js';

export class TeamService {
  public async getMembers(workspaceId: number) {
    return DB.table('workspace_members')
      .select('workspace_members.*', 'users.name', 'users.email', 'users.avatar')
      .join('users', 'workspace_members.user_id', 'users.id')
      .where('workspace_members.workspace_id', workspaceId)
      .orderBy('workspace_members.created_at', 'ASC')
      .get();
  }

  public async getPendingInvitations(workspaceId: number) {
    return Invitation.where('workspace_id', workspaceId).whereNull('accepted_at').get();
  }

  public async createInvitation(workspaceId: number, email: string, role: string) {
    const token = Math.random().toString(36).substring(2) + Date.now().toString(36);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const invitation = await Invitation.create({
      workspace_id: workspaceId,
      email: email.trim().toLowerCase(),
      role,
      token,
      expires_at: expiresAt,
    });

    // Generate signed tamper-proof invitation URL using AeroJS UrlSigner
    const inviteUrl = UrlSigner.sign(
      `http://localhost:3000/invite/accept?token=${token}&email=${encodeURIComponent(email)}`,
      { expiresIn: 7 * 24 * 3600 }
    );

    return {
      invitation,
      inviteUrl,
    };
  }

  public async acceptInvitation(token: string, userId: number) {
    const invite = await Invitation.where('token', token).whereNull('accepted_at').first();
    if (!invite) throw new Error('Invalid or expired invitation token');

    invite.accepted_at = new Date().toISOString();
    await invite.save();

    const existingMember = await WorkspaceMember.where('workspace_id', invite.workspace_id).where('user_id', userId).first();
    if (!existingMember) {
      await WorkspaceMember.create({
        workspace_id: invite.workspace_id,
        user_id: userId,
        role: invite.role,
      });
    }

    const user = await User.find(userId);
    if (user) {
      user.current_workspace_id = invite.workspace_id;
      await user.save();
    }

    return invite;
  }
}
