import type { AeroContext } from 'aerojs';
import { TeamService } from '../services/TeamService.js';

export class TeamController {
  private teamService = new TeamService();

  public async index(ctx: AeroContext): Promise<void> {
    const user = ctx.state.user;
    const workspace = ctx.state.workspace;

    const members = await this.teamService.getMembers(workspace.id);
    const invitations = await this.teamService.getPendingInvitations(workspace.id);

    await ctx.inertia.render('Settings/Team', {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      workspace: {
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
      },
      members,
      invitations,
      latestInviteUrl: (ctx.req.query.inviteUrl as string) || null,
    });
  }

  public async invite(ctx: AeroContext): Promise<void> {
    const workspace = ctx.state.workspace;
    const { email, role } = ctx.body as any;

    if (!email) {
      ctx.status(422).json({ error: 'Email is required' });
      return;
    }

    const { inviteUrl } = await this.teamService.createInvitation(workspace.id, email, role || 'member');

    ctx.redirect(`/settings/team?inviteUrl=${encodeURIComponent(inviteUrl)}`);
  }
}
